import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { FaSpinner } from 'react-icons/fa6'
import { useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import { ToastContext } from '../../../lib/ToastContext'
import { useOrganizationOwnerUser, useUser } from '../../../lib/hooks'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_RESOURCE } from '../../shared/mutation/resource'
import Checkbox from '../../shared/form/Checkbox'
import UrlInput from '../../shared/form/UrlInput'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import FileUploader from '../../shared/form/FileUploader'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import { PAGINATED_RESOURCES_QUERY, RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/resource'
import { generateResourceTopicOptions, generateResourceTypeOptions } from '../../shared/form/options'
import Select from '../../shared/form/Select'

const ResourceForm = React.memo(({ resource, organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = resource?.slug ?? ''

  const { user, loadingUserSession } = useUser()
  const { isOrganizationOwner } = useOrganizationOwnerUser(organization)
  const canEdit = user?.isAdminUser || user?.isEditorUser || (organization && isOrganizationOwner)

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const resourceTypeOptions = useMemo(() => generateResourceTypeOptions(format), [format])
  const resourceTopicOptions = useMemo(() => generateResourceTopicOptions(format), [format])

  const [updateResource, { reset }] = useMutation(CREATE_RESOURCE, {
    refetchQueries: [{
      query: RESOURCE_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_RESOURCES_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createResource.resource && data.createResource.errors.length === 0) {
        const redirectPath = `/${locale}/resources/${data.createResource.resource.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.resource.label') }),
          redirectHandler
        )
      } else {
        setMutating(false)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.label') }))
        reset()
      }
    },
    onError: () => {
      setMutating(false)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.resource.label') }))
      reset()
    }
  })

  const [resourceAuthor] = resource?.authors ?? []
  const { handleSubmit, register, control, watch, setValue, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: resource?.name,
      description: resource?.description,
      showInWizard: resource?.showInWizard,
      showInExchange: resource?.showInExchange,
      publishedDate: resource?.publishedDate,
      featured: resource?.featured,
      spotlight: resource?.spotlight,
      resourceLink: resource?.resourceLink,
      linkDescription: resource?.linkDescription,
      source: resource?.source,
      resourceType: resourceTypeOptions?.find(({ value: type }) => type === resource?.resourceType),
      resourceTopic: resource?.resourceTopic,
      authorName: resourceAuthor?.name,
      authorEmail: resourceAuthor?.email
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
        description,
        showInWizard,
        showInExchange,
        publishedDate,
        featured,
        spotlight,
        resourceLink,
        linkDescription,
        source,
        resourceType,
        resourceTopic,
        authorName,
        authorEmail,
        imageFile
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        slug,
        name,
        description,
        showInWizard,
        showInExchange,
        publishedDate,
        featured,
        spotlight,
        resourceLink,
        linkDescription,
        source,
        resourceType: resourceType?.value,
        resourceTopic,
        authorName,
        authorEmail
      }

      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      if (organization) {
        variables.organizationSlug = organization.slug
      }

      updateResource({
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
    router.push(`/${locale}/resources/${slug}`)
  }

  const onSpotlightChecked = (event) => {
    if (event.target.checked) {
      setValue('featured', event.target.checked)
    }
  }

  return loadingUserSession
    ? <Loading />
    : canEdit
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {resource
                  ? format('app.editEntity', { entity: resource.name })
                  : `${format('app.createNew')} ${format('ui.resource.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='name'>
                  {format('ui.resource.name')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('ui.resource.name')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field'>
                  {format('ui.resource.publishedDate')}
                </label>
                <Input
                  {...register('publishedDate', { required: format('validation.required') })}
                  type='date'
                  placeholder={format('ui.resource.publishedDate')}
                  isInvalid={errors.publishedDate}
                  defaultValue={new Date().toISOString().substring(0, 10)}
                />
                {errors.publishedDate && <ValidationError value={errors.publishedDate?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className=''>
                  {format('ui.resource.imageFile')}
                </label>
                <FileUploader {...register('imageFile')} />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='resourceTopic'>
                  {format('ui.resource.resourceType')}
                </label>
                <Controller
                  name='resourceType'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isSearch
                      isBorderless
                      options={resourceTypeOptions}
                      placeholder={format('ui.resource.resourceType')}
                    />
                  )}
                />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='resourceTopic'>
                  {format('ui.resource.resourceTopic')}
                </label>
                <Controller
                  name='resourceTopic'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isSearch
                      isBorderless
                      options={resourceTopicOptions}
                      placeholder={format('ui.resource.resourceTopic')}
                    />
                  )}
                />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='resourceLink'>
                  {format('ui.resource.resourceLink')}
                </label>
                <Controller
                  name='resourceLink'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <UrlInput
                      value={value}
                      onChange={onChange}
                      id='resourceLink'
                      isInvalid={errors.website}
                      placeholder={format('ui.resource.resourceLink')}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.resourceLink && <ValidationError value={errors.resourceLink?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='linkDescription'>
                  {format('ui.resource.linkDescription')}
                </label>
                <Input
                  {...register('linkDescription', { required: format('validation.required') })}
                  id='linkDescription'
                  placeholder={format('ui.resource.linkDescription')}
                  isInvalid={errors.linkDescription}
                />
                {errors.linkDescription && <ValidationError value={errors.linkDescription?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='source'>
                  {format('ui.resource.source')}
                </label>
                <Input
                  {...register('source')}
                  id='source'
                  placeholder={format('ui.resource.source')}
                  isInvalid={errors.source}
                />
                {errors.source && <ValidationError value={errors.source?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field'>
                  {format('ui.resource.description')}
                </label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <HtmlEditor
                      editorId='description-editor'
                      onChange={onChange}
                      initialContent={value}
                      placeholder={format('ui.resource.description')}
                      isInvalid={errors.description}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.description && <ValidationError value={errors.description?.message} />}
              </div>
              <hr className='h-px border-dashed' />
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='authorName'>
                  {format('ui.resource.authorName')}
                </label>
                <Input
                  {...register('authorName', { required: format('validation.required') })}
                  id='authorName'
                  placeholder={format('ui.resource.authorName')}
                  isInvalid={errors.authorName}
                />
                {errors.authorName && <ValidationError value={errors.authorName?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='authorEmail'>
                  {format('ui.resource.authorEmail')}
                </label>
                <Input
                  {...register('authorEmail')}
                  id='authorEmail'
                  placeholder={format('ui.resource.authorEmail')}
                />
              </div>
              {user?.isAdminUser &&
                <>
                  <hr className='h-px border-dashed' />
                  <div className='text-base text-dial-blueberry font-semibold'>
                    {format('app.adminOnly')}
                  </div>
                  <hr className='h-px border-dashed' />
                  <div className='flex flex-wrap'>
                    <label className='flex gap-x-2 items-center self-start basis-1/2 shrink-0'>
                      <Checkbox {...register('showInExchange')} />
                      {format('ui.resource.showInExchange')}
                    </label>
                    <label className='flex gap-x-2 items-center self-start basis-1/2 shrink-0'>
                      <Checkbox {...register('showInWizard')} />
                      {format('ui.resource.showInWizard')}
                    </label>
                  </div>
                  <hr className='h-px border-dashed' />
                  <div className='flex flex-wrap'>
                    <label className='flex gap-x-2 items-center self-start basis-1/2 shrink-0'>
                      <Checkbox {...register('spotlight', { onChange: onSpotlightChecked })} />
                      {format('ui.resource.spotlight')}
                    </label>
                    <label className='flex gap-x-2 items-center self-start basis-1/2 shrink-0'>
                      <Checkbox {...register('featured')} disabled={watch('spotlight')} />
                      {format('ui.resource.featured')}
                    </label>
                  </div>
                  <hr className='h-px border-dashed' />
                </>
              }
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button type='submit' className='submit-button' disabled={mutating || reverting}>
                  {`${format('app.submit')} ${format('ui.resource.label')}`}
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
          </div>
        </form>
      )
      : <Unauthorized />
})

ResourceForm.displayName = 'ResourceForm'

export default ResourceForm
