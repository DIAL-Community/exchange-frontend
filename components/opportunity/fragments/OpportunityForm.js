import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
import { Controller, useForm } from 'react-hook-form'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_OPPORTUNITY } from '../../shared/mutation/opportunity'
import UrlInput from '../../shared/form/UrlInput'
import {
  generateOpportunityStatusOptions,
  generateOpportunityTypeOptions,
  generateOriginOptions
} from '../../shared/form/options'
import Select from '../../shared/form/Select'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import {
  OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY,
  PAGINATED_OPPORTUNITIES_QUERY
} from '../../shared/query/opportunity'
import Checkbox from '../../shared/form/Checkbox'

const OpportunityForm = React.memo(({ opportunity }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = opportunity?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateOpportunity, { reset }] = useMutation(CREATE_OPPORTUNITY, {
    refetchQueries: [{
      query: OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_OPPORTUNITIES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createOpportunity.opportunity && data.createOpportunity.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}/opportunities/${data.createOpportunity.opportunity.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.opportunity.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.opportunity.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.opportunity.label') }))
      setMutating(false)
      reset()
    }
  })

  const statusOptions = useMemo(() => generateOpportunityStatusOptions(format), [format])
  const [defaultStatusOption] = statusOptions

  const typeOptions = useMemo(() => generateOpportunityTypeOptions(format), [format])
  const [defaultTypeOption] = typeOptions

  const originOptions = useMemo(() => generateOriginOptions(), [])
  const [defaultOriginOption] = originOptions.filter(originOption => originOption.value === 'manually_entered')

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm({
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
      opportunityOrigin:
        originOptions.find(
          ({ value: origin }) => origin === opportunity?.origin.slug
        ) ?? defaultOriginOption,
      opportunityType:
        typeOptions.find(
          ({ value: type }) => type === opportunity?.opportunityType
        ) ?? defaultTypeOption,
      opportunityStatus:
        statusOptions.find(
          ({ value: status }) => status === opportunity?.opportunityStatus
        ) ?? defaultStatusOption,
      govStackEntity: opportunity?.govStackEntity
    }
  })

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
        opportunityStatus,
        opportunityOrigin,
        govStackEntity
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
        opportunityStatus: opportunityStatus?.value,
        opportunityOrigin: opportunityOrigin?.value,
        govStackEntity
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
    router.push(`/${locale}/opportunities/${slug}`)
  }

  return loadingUserSession
    ? <Loading />
    : isAdminUser || isEditorUser ?
      <form onSubmit={handleSubmit(doUpsert)}>
        <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {opportunity
                ? format('app.editEntity', { entity: opportunity.name })
                : `${format('app.createNew')} ${format('ui.opportunity.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
                {format('ui.opportunity.name')}
              </label>
              <Input
                {...register('name', { required: format('validation.required') })}
                id='name'
                placeholder={format('ui.opportunity.name')}
                isInvalid={errors.name}
              />
              {errors.name && <ValidationError value={errors.name?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label>
                {format('ui.opportunity.imageFile')}
              </label>
              <FileUploader {...register('imageFile')} />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='webAddress'>
                {format('ui.opportunity.webAddress')}
              </label>
              <Controller
                name='webAddress'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput
                    id='webAddress'
                    value={value}
                    onChange={onChange}
                    isInvalid={errors.webAddress}
                    placeholder={format('ui.opportunity.webAddress')}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.webAddress && <ValidationError value={errors.webAddress?.message} />}
            </div>
            <div className='border-b border-dashed border-dial-plum' />
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='opportunityStatus'>
                {format('ui.opportunity.opportunityStatus')}
              </label>
              <Controller
                id='opportunityStatus'
                name='opportunityStatus'
                control={control}
                render={
                  ({ field }) =>
                    <Select
                      {...field}
                      options={statusOptions}
                      placeholder={format('ui.opportunity.opportunityStatus')}
                    />
                }
              />
              {errors.opportunityStatus && <ValidationError value={errors.opportunityStatus?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='opportunityType'>
                {format('ui.opportunity.opportunityType')}
              </label>
              <Controller
                id='opportunityType'
                name='opportunityType'
                control={control}
                render={
                  ({ field }) =>
                    <Select
                      {...field}
                      options={typeOptions}
                      placeholder={format('ui.opportunity.opportunityType')}
                    />
                }
              />
              {errors.opportunityType && <ValidationError value={errors.opportunityType?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='opportunityOrigin'>
                {format('ui.opportunity.origin')}
              </label>
              <Controller
                id='opportunityOrigin'
                name='opportunityOrigin'
                control={control}
                render={
                  ({ field }) =>
                    <Select
                      {...field}
                      options={originOptions}
                      placeholder={format('ui.opportunity.origin')}
                    />
                }
              />
              {errors.opportunityOrigin && <ValidationError value={errors.opportunityOrigin?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='openingDate'>
                {format('ui.opportunity.openingDate')}
              </label>
              <Input
                id='openingDate'
                {...register('openingDate')}
                type='date'
                placeholder={format('ui.opportunity.openingDate')}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='closingDate'>
                {format('ui.opportunity.closingDate')}
              </label>
              <Input
                id='closingDate'
                type='date'
                {...register('closingDate')}
                placeholder={format('ui.opportunity.closingDate')}
              />
            </div>
            <div className='border-b border-dashed border-dial-plum' />
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='contactName'>
                {format('ui.opportunity.contactName')}
              </label>
              <Input
                {...register('contactName', { required: format('validation.required') })}
                id='contactName'
                placeholder={format('ui.opportunity.contactName')}
                isInvalid={errors.contactName}
              />
              {errors.contactName && <ValidationError value={errors.contactName?.message} />}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='contactEmail'>
                {format('ui.opportunity.contactEmail')}
              </label>
              <Input
                {...register('contactEmail', { required: format('validation.required') })}
                id='contactEmail'
                placeholder={format('ui.opportunity.contactEmail')}
                isInvalid={errors.contactEmail}
              />
              {errors.contactEmail && <ValidationError value={errors.contactEmail?.message} />}
            </div>
            {isAdminUser &&
              <label className='flex gap-x-2 items-center self-start'>
                <Checkbox {...register('govStackEntity')} />
                {format('ui.opportunity.govStackEntity')}
              </label>
            }
            <div className='flex flex-col gap-y-2'>
              <label className='required-field'>
                {format('ui.opportunity.description')}
              </label>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='description-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('ui.opportunity.description')}
                    isInvalid={errors.description}
                  />
                )}
                rules={{ required: format('validation.required') }}
              />
              {errors.description && <ValidationError value={errors.description?.message} />}
            </div>
            <div className='flex flex-wrap text-base mt-6 gap-3'>
              <button type='submit' className='submit-button' disabled={mutating || reverting}>
                {`${format('app.submit')} ${format('ui.opportunity.label')}`}
                {mutating && <FaSpinner className='spinner ml-3' />}
              </button>
              <button type='button' className='cancel-button' disabled={mutating || reverting} onClick={cancelForm}>
                {format('app.cancel')}
                {reverting && <FaSpinner className='spinner ml-3' />}
              </button>
            </div>
          </div>
        </div>
      </form>
      : <Unauthorized />
})

OpportunityForm.displayName = 'OpportunityForm'

export default OpportunityForm
