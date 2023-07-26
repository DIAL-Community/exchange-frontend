import React, { useState, useCallback, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import Input from '../shared/Input'
import FileUploader from '../shared/FileUploader'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../lib/ToastContext'
import ValidationError from '../shared/ValidationError'
import { CREATE_OPPORTUNITY } from '../../mutations/opportunity'
import UrlInput from '../shared/UrlInput'
import { useUser } from '../../lib/hooks'
import Select from '../shared/Select'
import { getOpportunityStatusOptions, getOpportunityTypeOptions } from '../../lib/utilities'

const OpportunityForm = React.memo(({ opportunity }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { user } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)
  const { locale } = useRouter()

  const statusOptions = getOpportunityStatusOptions(format)
  const [defaultStatusOption] = statusOptions

  const typeOptions = getOpportunityTypeOptions(format)
  const [defaulTypeOption] = typeOptions

  const [updateOpportunity, { reset }] = useMutation(CREATE_OPPORTUNITY, {
    onCompleted: (data) => {
      setMutating(false)
      const { createOpportunity: response } = data
      if (response?.opportunity && response?.errors?.length === 0) {
        showToast(
          format('opportunity.submit.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push(
            `/${router.locale}` +
            `/opportunities/${response?.opportunity?.slug}`
          )
        )
      } else {
        showToast(format('opportunity.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      showToast(format('opportunity.submit.failure'), 'error', 'top-center')
      setMutating(false)
      reset()
    }
  })

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: opportunity?.name,
      webAddress: opportunity?.webAddress ?? '',
      description: opportunity?.description,
      contactName: opportunity?.contactName,
      contactEmail: opportunity?.contactEmail,
      openingDate: opportunity?.openingDate,
      closingDate: opportunity?.closingDate,
      opportunityType:
        typeOptions.find(
          ({ value: type }) => type === opportunity?.opportunityType
        ) ?? defaulTypeOption,
      opportunityStatus:
        statusOptions.find(
          ({ value: status }) => status === opportunity?.opportunityStatus
        ) ?? defaultStatusOption
    }
  })

  const slug = opportunity?.slug ?? ''

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (opportunity) {
      map[opportunity.slug] = opportunity.name
    }

    return map
  }, [opportunity, format])

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        name,
        imageFile,
        webAddress,
        description,
        contactName,
        contactEmail,
        openingDate,
        closingDate,
        opportunityType,
        opportunityStatus
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        webAddress,
        description,
        contactName,
        contactEmail,
        openingDate,
        closingDate,
        opportunityType: opportunityType?.value,
        opportunityStatus: opportunityStatus?.value
      }
      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateOpportunity({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelForm = () => {
    setReverting(true)
    let route = '/opportunities'
    if (opportunity) {
      route = `${route}/${opportunity.slug}`
    }

    router.push(route)
  }

  return (
    <div className='flex flex-col'>
      <div className='hidden lg:block px-8'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='pb-8 px-8'>
        <div id='content' className='sm:px-0 max-w-full mx-auto'>
          <form onSubmit={handleSubmit(doUpsert)}>
            <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
              <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                {opportunity
                  ? format('app.editEntity', { entity: opportunity.name })
                  : `${format('app.createNew')} ${format('opportunity.label')}`
                }
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='opportunity-name'>
                    <label className='text-dial-sapphire required-field' htmlFor='name'>
                      {format('opportunity.name')}
                    </label>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      id='name'
                      placeholder={format('opportunity.name')}
                      isInvalid={errors.name}
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2' data-testid='opportunity-logo'>
                    <label className='text-dial-sapphire'>
                      {format('opportunity.imageFile')}
                    </label>
                    <FileUploader {...register('imageFile')} />
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-dial-sapphire required-field' htmlFor='opportunityStatus'>
                      {format('opportunity.opportunityStatus')}
                    </label>
                    <Controller
                      name='opportunityStatus'
                      control={control}
                      render={
                        ({ field }) =>
                          <Select
                            {...field}
                            options={statusOptions}
                            placeholder={format('opportunity.opportunityStatus')}
                          />
                      }
                    />
                    {errors.opportunityStatus && <ValidationError value={errors.opportunityStatus?.message} />}
                  </div>
                  <div className='border-b border-dashed border-dial-lavender' />
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-dial-sapphire required-field' htmlFor='opportunityType'>
                      {format('opportunity.opportunityType')}
                    </label>
                    <Controller
                      name='opportunityType'
                      control={control}
                      render={
                        ({ field }) =>
                          <Select
                            {...field}
                            options={typeOptions}
                            placeholder={format('opportunity.opportunityType')}
                          />
                      }
                    />
                    {errors.opportunityType && <ValidationError value={errors.opportunityType?.message} />}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-dial-sapphire required-field' htmlFor='webAddress'>
                      {format('opportunity.webAddress')}
                    </label>
                    <Controller
                      name='webAddress'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <UrlInput
                          value={value}
                          onChange={onChange}
                          id='webAddress'
                          isInvalid={errors.webAddress}
                          placeholder={format('opportunity.webAddress')}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.webAddress && <ValidationError value={errors.webAddress?.message} />}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-dial-sapphire'>
                      {format('opportunity.openingDate')}
                    </label>
                    <Input
                      {...register('openingDate')}
                      type='date'
                      placeholder={format('opportunity.openingDate')}
                    />
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-dial-sapphire'>
                      {format('opportunity.closingDate')}
                    </label>
                    <Input
                      {...register('closingDate')}
                      type='date'
                      placeholder={format('opportunity.closingDate')}
                    />
                  </div>
                  <div className='border-b border-dashed border-dial-lavender' />
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-dial-sapphire required-field' htmlFor='contactName'>
                      {format('opportunity.contactName')}
                    </label>
                    <Input
                      {...register('contactName', { required: format('validation.required') })}
                      id='contactName'
                      placeholder={format('opportunity.contactName')}
                      isInvalid={errors.contactName}
                    />
                    {errors.contactName && <ValidationError value={errors.contactName?.message} />}
                  </div>
                  <div className='flex flex-col gap-y-2 mb-2'>
                    <label className='text-dial-sapphire required-field' htmlFor='contactEmail'>
                      {format('opportunity.contactEmail')}
                    </label>
                    <Input
                      {...register('contactEmail', { required: format('validation.required') })}
                      id='contactEmail'
                      placeholder={format('opportunity.contactEmail')}
                      isInvalid={errors.contactEmail}
                    />
                    {errors.contactEmail && <ValidationError value={errors.contactEmail?.message} />}
                  </div>
                </div>
                <div className='w-full lg:w-1/2'>
                  <div className='block flex flex-col gap-y-2' data-testid='opportunity-description'>
                    <label className='text-dial-sapphire required-field'>
                      {format('opportunity.description')}
                    </label>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <HtmlEditor
                          editorId='description-editor'
                          onChange={onChange}
                          initialContent={value}
                          placeholder={format('opportunity.description')}
                          isInvalid={errors.description}
                        />
                      )}
                      rules={{ required: format('validation.required') }}
                    />
                    {errors.description && <ValidationError value={errors.description?.message} />}
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap text-xl mt-8 gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                  data-testid='submit-button'
                >
                  {`${format('app.submit')} ${format('opportunity.label')}`}
                  {mutating && <FaSpinner className='spinner ml-3' />}
                </button>
                <button
                  type='button'
                  className='cancel-button'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('app.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3' />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

OpportunityForm.displayName = 'OpportunityForm'

export default OpportunityForm
