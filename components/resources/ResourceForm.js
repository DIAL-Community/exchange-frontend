import React, { useState, useCallback, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import Input from '../shared/Input'
import { ToastContext } from '../../lib/ToastContext'
import ValidationError from '../shared/ValidationError'
import { Loading, Unauthorized } from '../shared/FetchStatus'
import { useOrganizationOwnerUser, useUser } from '../../lib/hooks'
import { CREATE_RESOURCE } from '../../mutations/resource'
import FileUploader from '../shared/FileUploader'
import UrlInput from '../shared/UrlInput'
import Checkbox from '../shared/Checkbox'

const ResourceForm = React.memo(({ resource, organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = resource?.slug ?? ''

  const router = useRouter()
  const { locale } = router

  const { isOrganizationOwner } = useOrganizationOwnerUser(organization)
  const { user, isAdminUser, loadingUserSession } = useUser()
  const canEdit = user?.isAdminUser || user?.isEditorUser || (organization && isOrganizationOwner)

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showToast } = useContext(ToastContext)

  const [updateResource, { reset }] = useMutation(CREATE_RESOURCE, {
    onCompleted: (data) => {
      const { createResource: response } = data
      if (response?.resource && response?.errors?.length === 0) {
        showToast(
          format('resource.submit.success'),
          'success',
          'top-center',
          1000,
          null,
          () => {
            if (organization) {
              router.push(`/${router.locale}/storefronts/${organization.slug}`)
            } else {
              router.push(`/${router.locale}/resources/${response?.resource?.slug}`)
            }
          }
        )
        setMutating(false)
      } else {
        showToast(format('resource.submit.failure'), 'error', 'top-center')
        setMutating(false)
        reset()
      }
    },
    onError: (error) => {
      showToast(
        <div className='flex flex-col'>
          <span>{format('resource.submit.failure')}</span>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      setMutating(false)
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

  const slugNameMapping = useMemo(() => {
    const map = {
      create: format('app.create'),
      edit: format('app.edit')
    }

    if (resource) {
      map[resource.slug] = resource.name
    }

    if (organization) {
      map[organization.slug] = organization.name
    }

    return map
  }, [resource, organization, format])

  const doUpsert = async (data) => {
    if (canEdit) {
      setMutating(true)
      const { userEmail, userToken } = user
      const { name, link, imageFile, description, showInExchange, showInWizard } = data
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
    if (!resource && organization) {
      router.push(`/storefronts/${organization.slug}`)
    } else {
      router.push(`/resources/${resource?.slug ?? ''}`)
    }
  }

  return (
    loadingUserSession ? <Loading /> : canEdit ? (
      <div className='flex flex-col'>
        <div className='hidden lg:block px-8'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='pb-8 px-8'>
          <div id='content' className='sm:px-0 max-w-full mx-auto'>
            <form onSubmit={handleSubmit(doUpsert)}>
              <div className='bg-edit shadow-md rounded px-8 pt-6 pb-12 mb-4 flex flex-col gap-3'>
                <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                  {resource
                    ? format('app.editEntity', { entity: resource.name })
                    : `${format('app.createNew')} ${format('resource.label')}`
                  }
                </div>
                <div className='flex flex-col lg:flex-row gap-4'>
                  <div className='w-full lg:w-1/2 flex flex-col gap-y-3'>
                    <div className='form-field-wrapper' data-testid='resource-name'>
                      <label className='form-field-label required-field' htmlFor='name'>
                        {format('resource.name')}
                      </label>
                      <Input
                        {...register('name', { required: format('validation.required') })}
                        id='name'
                        placeholder={format('resource.name')}
                        isInvalid={errors.name}
                      />
                      {errors.name && <ValidationError value={errors.name?.message} />}
                    </div>
                    <div className='form-field-wrapper'>
                      <label className='form-field-label'>
                        {format('resource.imageFile')}
                      </label>
                      <FileUploader {...register('imageFile')} />
                    </div>
                    <div className='flex flex-col gap-y-2 mb-2'>
                      <label className='text-dial-sapphire required-field' htmlFor='link'>
                        {format('resource.link')}
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
                            placeholder={format('resource.link')}
                          />
                        )}
                        rules={{ required: format('validation.required') }}
                      />
                      {errors.link && <ValidationError value={errors.link?.message} />}
                    </div>
                    {isAdminUser &&
                      <label className='flex gap-x-2 mb-2 items-center self-start'>
                        <Checkbox {...register('showInExchange')} />
                        {format('resource.showInExchange')}
                      </label>
                    }
                    {isAdminUser &&
                      <label className='flex gap-x-2 mb-2 items-center self-start'>
                        <Checkbox {...register('showInWizard')} />
                        {format('resource.showInWizard')}
                      </label>
                    }
                  </div>
                  <div className='w-full lg:w-1/2'>
                    <div className='block flex flex-col gap-y-2' data-testid='resource-description'>
                      <label className='form-field-label required-field'>
                        {format('resource.description')}
                      </label>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <HtmlEditor
                            editorId='description-editor'
                            onChange={onChange}
                            initialContent={value}
                            placeholder={format('resource.description')}
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
                    {`${format('app.submit')} ${format('resource.label')}`}
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
                { organization &&
                  <div className='text-sm italic text-emerald-500'>
                    {format('resource.fromStorefront')}
                  </div>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    ) : <Unauthorized />
  )
})

ResourceForm.displayName = 'ResourceForm'

export default ResourceForm
