import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ToastContext } from '../../../../lib/ToastContext'
import { useUser } from '../../../../lib/hooks'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { CREATE_OPPORTUNITY } from '../../shared/mutation/opportunity'
import IconButton from '../../shared/form/IconButton'
import UrlInput from '../../shared/form/UrlInput'
import Checkbox from '../../shared/form/Checkbox'

const OpportunityForm = React.memo(({ opportunity }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = opportunity?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const [updateOpportunity, { reset }] = useMutation(CREATE_OPPORTUNITY, {
    onCompleted: (data) => {
      if (data.createOpportunity.opportunity && data.createOpportunity.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}/opportunities/${data.createOpportunity.opportunity.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showToast(format('opportunity.submit.success'), 'success', 'top-center', 1000, null, redirectHandler)
      } else {
        setMutating(false)
        showToast(format('opportunity.submit.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showToast(format('opportunity.submit.failure'), 'error', 'top-center')
      reset()
    }
  })

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
      aliases: opportunity?.aliases?.length ? opportunity?.aliases.map((value) => ({ value })) : [{ value: '' }],
      website: opportunity?.website,
      description: opportunity?.opportunityDescription?.description,
      commercialOpportunity: opportunity?.commercialOpportunity,
      hostingModel: opportunity?.hostingModel,
      pricingModel: opportunity?.pricingModel,
      pricingDetails: opportunity?.pricingDetails,
      pricingUrl: opportunity?.pricingUrl
    }
  })

  const { fields: aliases, append, remove } = useFieldArray({
    control,
    name: 'aliases',
    shouldUnregister: true
  })

  const isSingleAlias = useMemo(() => aliases.length === 1, [aliases])
  const isLastAlias = (aliasIndex) => aliasIndex === aliases.length - 1

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        name,
        imageFile,
        website,
        description,
        aliases,
        commercialOpportunity,
        pricingUrl,
        hostingModel,
        pricingModel,
        pricingDetails
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        aliases: aliases.map(({ value }) => value),
        website,
        description,
        commercialOpportunity,
        pricingUrl,
        hostingModel,
        pricingModel,
        pricingDetails
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
        <div className='px-4 py-4 lg:py-6 text-dial-meadow'>
          <div className='flex flex-col gap-y-6 text-sm'>
            <div className='text-xl font-semibold'>
              {opportunity
                ? format('app.editEntity', { entity: opportunity.name })
                : `${format('app.createNew')} ${format('ui.opportunity.label')}`}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label className='required-field' htmlFor='name'>
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
            <div className='flex flex-col gap-y-2'>
              <label>{format('opportunity.aliases')}</label>
              {aliases.map((alias, aliasIdx) => (
                <div key={alias.id} className='flex gap-x-2'>
                  <Input {...register(`aliases.${aliasIdx}.value`)} placeholder={format('opportunity.alias')} />
                  {isLastAlias(aliasIdx) &&
                    <IconButton
                      className='bg-dial-meadow'
                      icon={<FaPlus className='text-sm' />}
                      onClick={() => append({ value: '' })}
                    />
                  }
                  {!isSingleAlias &&
                    <IconButton
                      className='bg-dial-meadow'
                      icon={<FaMinus className='text-sm' />}
                      onClick={() => remove(aliasIdx)}
                    />
                  }
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='website'>
                {format('opportunity.website')}
              </label>
              <Controller
                id='website'
                name='website'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput value={value} onChange={onChange} id='website' placeholder={format('opportunity.website')} />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label>{format('opportunity.imageFile')}</label>
              <FileUploader {...register('imageFile')} />
            </div>
            <div className='block flex flex-col gap-y-2'>
              <label className='required-field'>{format('opportunity.description')}</label>
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
            <hr className='my-3' />
            <div className='text-2xl font-semibold pb-4'>{format('opportunity.pricingInformation')}</div>
            <label className='flex gap-x-2 mb-2 items-center self-start'>
              <Checkbox {...register('commercialOpportunity')} />
              {format('opportunity.commercialOpportunity')}
            </label>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='pricingUrl'>
                {format('opportunity.pricingUrl')}
              </label>
              <Controller
                name='pricingUrl'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <UrlInput
                    value={value}
                    onChange={onChange}
                    id='pricingUrl'
                    placeholder={format('opportunity.pricingUrl')}
                  />
                )}
              />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='hostingModel'>
                {format('opportunity.hostingModel')}
              </label>
              <Input {...register('hostingModel')} id='hostingModel' placeholder={format('opportunity.hostingModel')} />
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='pricingModel'>
                {format('opportunity.pricingModel')}
              </label>
              <Input {...register('pricingModel')} id='pricingModel' placeholder={format('opportunity.pricingModel')} />
            </div>
            <div className='block flex flex-col gap-y-2'>
              <label>{format('opportunity.pricing.details')}</label>
              <Controller
                name='pricingDetails'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <HtmlEditor
                    editorId='pricing-details-editor'
                    onChange={onChange}
                    initialContent={value}
                    placeholder={format('opportunity.pricing.details')}
                    isInvalid={errors.pricingDetails}
                  />
                )}
              />
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
