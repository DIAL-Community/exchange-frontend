import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import classNames from 'classnames'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import ValidationError from '../../shared/form/ValidationError'
import { useUser } from '../../../../lib/hooks'
import { AUTOSAVE_PLAYBOOK, CREATE_PLAYBOOK } from '../../shared/mutation/playbook'
import { ToastContext } from '../../../../lib/ToastContext'
import Input from '../../shared/form/Input'
import FileUploader from '../../shared/form/FileUploader'
import Checkbox from '../../shared/form/Checkbox'
import { Loading, Unauthorized } from '../../shared/FetchStatus'
import { fetchSelectOptions } from '../../utils/search'
import { TAG_SEARCH_QUERY } from '../../shared/query/tag'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'

const PUBLISHED_CHECKBOX_FIELD_NAME = 'published'

const FormTextEditor = ({ control, name, placeholder = null, required = false, isInvalid = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-2 text-sm'>
      <label className={classNames({ 'required-field': required })}>
        {format(`ui.playbook.${name}`)}
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
export const PlaybookForm = React.memo(({ playbook }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { user, loadingUserSession } = useUser()

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
        showSuccessMessage(format('ui.playbook.submitted'),
          () => router.push(`/${router.locale}/playbooks/${response.playbook.slug}`)
        )
      } else {
        showFailureMessage(response.errors)
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
        showSuccessMessage(format('ui.playbook.autoSaved'))
      }
    }
  })

  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: playbook?.name,
      author: playbook?.author,
      overview: playbook?.playbookDescription.overview,
      audience: playbook?.playbookDescription.audience,
      outcomes: playbook?.playbookDescription.outcomes,
      published: playbook ? !playbook.draft : false
    }
  })
  const isPublished = watch(PUBLISHED_CHECKBOX_FIELD_NAME)

  const [slug, setSlug] = useState(playbook ? playbook.slug : '')
  const [tags, setTags] = useState(playbook?.tags.map(tag => ({ label: tag, value: tag })) ?? [])

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const doUpsert = async (data) => {
    if (user) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { name, cover, author, overview, audience, outcomes, published } = data
      const [coverFile] = cover
      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        slug,
        author,
        overview,
        audience,
        outcomes,
        cover: coverFile,
        tags: tags.map(tag => tag.label),
        draft: !published
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
        author,
        overview,
        audience,
        outcomes,
        tags: tags.map(tag => tag.label)
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
  }, [user, slug, tags, locale, watch, autoSavePlaybook])

  const cancelForm = () => {
    setReverting(true)
    let route = '/playbooks'
    if (playbook) {
      route = `${route}/${playbook.slug}`
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
    : user?.isAdminUser || user?.isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {playbook && format('app.editEntity', { entity: playbook.name })}
                {!playbook && `${format('app.createNew')} ${format('ui.playbook.label')}`}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='name'>
                  {format('ui.playbook.name')}
                </label>
                <Input
                  {...register('name', { required: format('validation.required') })}
                  id='name'
                  placeholder={format('ui.playbook.name')}
                  isInvalid={errors.name}
                />
                {errors.name && <ValidationError value={errors.name?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label>
                  {format('ui.playbook.cover')}
                </label>
                <FileUploader {...register('cover')} />
              </div>
              <div className='flex flex-col gap-y-2'>
                <label htmlFor='author'>
                  {format('ui.playbook.author')}
                </label>
                <Input id='author' {...register('author')} placeholder={format('ui.playbook.author')} />
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
                placeholder={format('ui.playbook.overview')}
                required
                isInvalid={errors.overview}
              />
              <FormTextEditor
                control={control}
                name='audience'
                placeholder={format('ui.playbook.audience')}
              />
              <FormTextEditor
                control={control}
                name='outcomes'
                placeholder={format('ui.playbook.outcomes')}
              />
              <label className='flex gap-x-2 mb-2 items-center self-start'>
                <Checkbox {...register(PUBLISHED_CHECKBOX_FIELD_NAME)} />
                {format('ui.playbook.published')}
              </label>
              <div className='flex flex-wrap text-base mt-6 gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                >
                  {format(isPublished ? 'ui.playbook.publish' : 'ui.playbook.saveAsDraft')}
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

export default PlaybookForm
