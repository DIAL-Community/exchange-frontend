import React, { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa6'
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

  const { handleSubmit, register, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: resource?.name,
      link: resource?.link,
      description: resource?.description,
      showInExchange: resource?.showInExchange,
      showInWizard: resource?.showInWizard
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
        link,
        description,
        showInExchange,
        showInWizard,
        imageFile
      } = data
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        link,
        description,
        showInExchange,
        showInWizard
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
                  : `${format('app.createNew')} ${format('resource.label')}`}
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
                <label className=''>
                  {format('ui.resource.imageFile')}
                </label>
                <FileUploader {...register('imageFile')} />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='link'>
                  {format('ui.resource.link')}
                </label>
                <Controller
                  name='link'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <UrlInput
                      value={value}
                      onChange={onChange}
                      id='link'
                      isInvalid={errors.website}
                      placeholder={format('ui.resource.link')}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.link && <ValidationError value={errors.link?.message} />}
              </div>
              {user?.isAdminUser &&
                <label className='flex gap-x-2 mb-2 items-center self-start'>
                  <Checkbox {...register('showInExchange')} />
                  {format('ui.resource.showInExchange')}
                </label>
              }
              {user?.isAdminUser &&
                <label className='flex gap-x-2 mb-2 items-center self-start'>
                  <Checkbox {...register('showInWizard')} />
                  {format('ui.resource.showInWizard')}
                </label>
              }
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
