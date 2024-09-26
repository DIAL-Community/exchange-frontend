import React, { useCallback, useContext, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useActiveTenant, useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../../shared/FetchStatus'
import Checkbox from '../../../shared/form/Checkbox'
import FileUploader from '../../../shared/form/FileUploader'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import Input from '../../../shared/form/Input'
import Pill from '../../../shared/form/Pill'
import Select from '../../../shared/form/Select'
import ValidationError from '../../../shared/form/ValidationError'
import { AUTOSAVE_PLAYBOOK, CREATE_PLAYBOOK } from '../../../shared/mutation/playbook'
import { TAG_SEARCH_QUERY } from '../../../shared/query/tag'
import { fetchSelectOptions } from '../../../utils/search'
import { DPI_TENANT_NAME } from '../../constants'

const PUBLISHED_CHECKBOX_FIELD_NAME = 'published'

const FormTextEditor = ({ control, name, placeholder = null, required = false, isInvalid = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-2 text-sm'>
      <label className={classNames({ 'required-field': required })}>
        {format(`hub.curriculum.${name}`)}
      </label>
      <Controller
        name={name}
        control={control}
        rules={required && { required: format('validation.required') }}
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <HtmlEditor
              editorId={`${name}-editor`}
              onBlur={onBlur}
              onChange={onChange}
              placeholder={placeholder}
              initialContent={value}
              isInvalid={isInvalid}
            />
          )
        }}
      />
      {isInvalid && <ValidationError value={format('validation.required')} />}
    </div>
  )
}

// eslint-disable-next-line react/display-name
export const CurriculumForm = React.memo(({ curriculum }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { user, loadingUserSession } = useUser()

  const { tenant } = useActiveTenant()

  const client = useApolloClient()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { locale } = useRouter()
  const [updatePlaybook, { reset }] = useMutation(CREATE_PLAYBOOK, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { createPlaybook: response } = data
      if (response.errors.length === 0 && response.playbook) {
        setMutating(false)
        setSlug(response.playbook.slug)
        showSuccessMessage(
          format('hub.curriculum.submitted'),
          () => router.push(`/hub/curriculum/${response.playbook.slug}`)
        )
      } else {
        const [ firstErrorMessage ] = response.errors
        showFailureMessage(firstErrorMessage)
        setMutating(false)
        reset()
      }
    }
  })

  const [autoSavePlaybook, { reset: resetAutoSave }] = useMutation(AUTOSAVE_PLAYBOOK, {
    onError: () => {
      setMutating(false)
      resetAutoSave()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { autoSavePlaybook: response } = data
      if (response.errors.length === 0 && response.playbook) {
        setSlug(response.playbook.slug)
        showSuccessMessage(format('hub.curriculum.autoSaved'))
      }
    }
  })

  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: curriculum?.name,
      author: curriculum?.author,
      published: !curriculum?.draft ?? true,
      overview: curriculum?.playbookDescription.overview
    }
  })

  const [slug, setSlug] = useState(curriculum ? curriculum.slug : '')
  const [tags, setTags] = useState(curriculum?.tags.map(tag => ({ label: tag, value: tag })) ?? [])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { name, cover, author, overview, published } = data
      const [coverFile] = cover
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        owner: DPI_TENANT_NAME,
        author,
        overview,
        audience: '',
        outcomes: '',
        cover: coverFile,
        draft: !published,
        tags: tags.map(tag => tag.label)
      }

      updatePlaybook({
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

  useEffect(() => {
    const doAutoSave = () => {
      if (!user || !watch) {
        return
      }

      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { name, author, overview, audience, outcomes } = watch()

      if (!name && !overview) {
        // Minimum required fields are name and overview.
        setMutating(false)

        return
      }

      // Send graph query to the backend. Set the base variables needed to perform update.
      // Auto save will not save the cover file since it could be expensive.
      const variables = {
        name,
        slug,
        owner: DPI_TENANT_NAME,
        author,
        overview,
        audience,
        outcomes,
        tags: tags.map(tag => tag.label),
        draft: false
      }
      autoSavePlaybook({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }

    const interval = setInterval(() => {
      doAutoSave()
    }, 60000)

    return () => clearInterval(interval)
  }, [user, slug, tenant, tags, locale, watch, autoSavePlaybook])

  const cancelForm = () => {
    setReverting(true)
    let route = '/hub/curriculum'
    if (curriculum) {
      route = `${route}/${curriculum.slug}`
    }

    router.push(route)
  }

  const fetchedTagsCallback = (data) => (
    data?.tags?.map((tag) => ({
      value: tag.slug,
      label: tag.name,
      slug: tag.slug
    }))
  )

  const addTag = (tag) =>
    setTags([
      ...tags.filter(({ label }) => label !== tag.label),
      { label: tag.label, slug: tag.slug }
    ])

  const removeTag = (tag) =>
    setTags([...tags.filter(({ label }) => label !== tag.label)])

  const loadTagOptions = (input) =>
    fetchSelectOptions(client, input, TAG_SEARCH_QUERY, fetchedTagsCallback)

  return loadingUserSession
    ? <Loading />
    : user?.isAdminUser || user?.isEditorUser || user?.isAdliAdminUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {curriculum && format('app.editEntity', { entity: curriculum.name })}
                {!curriculum && `${format('app.createNew')} ${format('hub.curriculum.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='name'>
                  {format('hub.curriculum.name')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('hub.curriculum.name')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label>
                  {format('hub.curriculum.cover')}
                </label>
                <FileUploader {...register('cover')} />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='author'>
                  {format('hub.curriculum.author')}
                </label>
                <Input id='author' {...register('author')} placeholder={format('hub.curriculum.author')} />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='flex flex-col gap-y-2'>
                  {format('ui.tag.header')}
                  <Select
                    async
                    isBorderless
                    defaultOptions
                    cacheOptions
                    placeholder={format('ui.tag.header')}
                    loadOptions={loadTagOptions}
                    noOptionsMessage={() =>
                      format('filter.searchFor', { entity: format('ui.tag.header') })
                    }
                    onChange={addTag}
                    value={null}
                  />
                </label>
                <div className='flex flex-wrap gap-3 mt-2'>
                  {tags?.map((tag, tagIdx) =>(
                    <Pill
                      key={tagIdx}
                      label={tag.label}
                      onRemove={() => removeTag(tag)}
                    />
                  ))}
                </div>
              </div>
              <FormTextEditor
                control={control}
                name='overview'
                placeholder={format('hub.curriculum.overview')}
                required
                isInvalid={errors.overview}
              />
              <label className='flex gap-x-2 mb-2 items-center self-start'>
                <Checkbox {...register(PUBLISHED_CHECKBOX_FIELD_NAME)} />
                {format('hub.curriculum.published')}
              </label>
              <div className='flex flex-wrap text-sm gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                >
                  {format('hub.curriculum.save')}
                  {mutating && <FaSpinner className='spinner ml-3 inline' />}
                </button>
                <button
                  type='button'
                  className='cancel-button'
                  disabled={mutating || reverting}
                  onClick={cancelForm}
                >
                  {format('app.cancel')}
                  {reverting && <FaSpinner className='spinner ml-3 inline' />}
                </button>
              </div>
            </div>
          </div>
        </form>
      )
      : <Unauthorized />
})

export default CurriculumForm
