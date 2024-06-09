import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import FileUploader from '../../shared/form/FileUploader'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import Select from '../../shared/form/Select'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_RESOURCE_TOPIC } from '../../shared/mutation/resourceTopic'
import {
  PAGINATED_RESOURCE_TOPICS_QUERY, RESOURCE_TOPIC_PAGINATION_ATTRIBUTES_QUERY, RESOURCE_TOPIC_SEARCH_QUERY
} from '../../shared/query/resourceTopic'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const ResourceTopicForm = React.memo(({ resourceTopic }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slug = resourceTopic?.slug ?? ''

  const { user, isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const { data: parentTopicsData, loading: loadingParentTopics } = useQuery(RESOURCE_TOPIC_SEARCH_QUERY, {
    variables: { search: '', locale }
  })

  const parentTopicOptions = useMemo(
    () =>
      parentTopicsData?.resourceTopics?.map(({ id, slug, name }) => ({
        label: name,
        value: parseInt(id),
        slug
      })) ?? [],
    [parentTopicsData]
  )

  const [updateResourceTopic, { reset }] = useMutation(CREATE_RESOURCE_TOPIC, {
    refetchQueries: [{
      query: RESOURCE_TOPIC_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' }
    }, {
      query: PAGINATED_RESOURCE_TOPICS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 }
    }],
    onCompleted: (data) => {
      if (data.createResourceTopic.resourceTopic && data.createResourceTopic.errors.length === 0) {
        const redirectPath = `/${locale}/resource-topics/${data.createResourceTopic.resourceTopic.slug}`
        const redirectHandler = () => router.push(redirectPath)
        setMutating(false)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.resourceTopic.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.resourceTopic.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.resourceTopic.label') }))
      setMutating(false)
      reset()
    }
  })

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: resourceTopic?.name,
      description: resourceTopic?.resourceTopicDescription?.description,
      parentTopic: resourceTopic?.parentTopic?.id
    }
  })

  useEffect(
    () => {
      setValue(
        'parentTopic',
        parentTopicOptions.find(({ value }) => value === resourceTopic?.parentTopic?.id) | null
      )},
    [parentTopicOptions, setValue, resourceTopic?.parentTopic?.id]
  )

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const {
        name,
        description,
        parentTopic,
        imageFile
      } = data

      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        description,
        parentTopicId: parentTopic?.value
      }

      if (imageFile) {
        variables.imageFile = imageFile[0]
      }

      updateResourceTopic({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            'Authorization': `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/resource-topics/${slug}`)
  }

  return loadingUserSession|| loadingParentTopics
    ? <Loading />
    : isAdminUser || isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {resourceTopic
                  ? format('app.editEntity', { entity: resourceTopic.name })
                  : `${format('app.createNew')} ${format('ui.resourceTopic.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field' htmlFor='name'>
                  {format('ui.resourceTopic.name')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('ui.resourceTopic.name')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire' htmlFor='image-uploader'>
                  {format('useCase.imageFile')}
                </label>
                <FileUploader {...register('imageFile')} id='image-uploader' />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='text-dial-sapphire required-field'>
                  {format('ui.resourceTopic.description')}
                </label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <HtmlEditor
                      editorId='description-editor'
                      onChange={onChange}
                      initialContent={value}
                      placeholder={format('ui.resourceTopic.description')}
                      isInvalid={errors.description}
                    />
                  )}
                  rules={{ required: format('validation.required') }}
                />
                {errors.description && <ValidationError value={errors.description?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field text-dial-blueberry' htmlFor='parentTopic'>
                  {format('ui.resourceTopic.parentTopic')}
                </label>
                <Controller
                  name='parentTopic'
                  control={control}
                  defaultValue={parentTopicOptions.find(({ id }) => id === resourceTopic?.parentTopic?.id)}
                  render={({ field }) => (
                    <Select
                      id='parentTopic'
                      {...field}
                      isSearch
                      isBorderless
                      options={parentTopicOptions}
                      placeholder={format('ui.resourceTopic.parentTopic')}
                      isInvalid={errors.parentTopic}
                    />
                  )}
                />
                {errors.parentTopic && <ValidationError value={errors.parentTopic?.message} />}
              </div>
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button type='submit' className='submit-button' disabled={mutating || reverting}>
                  {`${format('app.submit')} ${format('ui.resourceTopic.label')}`}
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

ResourceTopicForm.displayName = 'ResourceTopicForm'

export default ResourceTopicForm
