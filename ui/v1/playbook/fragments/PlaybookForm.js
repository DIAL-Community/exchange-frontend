import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import classNames from 'classnames'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import ValidationError from '../../shared/form/ValidationError'
import { useUser } from '../../../../lib/hooks'
import { AUTOSAVE_PLAYBOOK, CREATE_PLAYBOOK } from '../../shared/mutation/playbook'
import { ToastContext } from '../../../../lib/ToastContext'
import Breadcrumb from '../../shared/Breadcrumb'
import Input from '../../shared/form/Input'
import FileUploader from '../../shared/form/FileUploader'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import Checkbox from '../../shared/form/Checkbox'

const PUBLISHED_CHECKBOX_FIELD_NAME = 'published'

const FormTextEditor = ({ control, name, placeholder = null, required = false, isInvalid = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='form-field-wrapper'>
      <label className={classNames({ 'required-field': required }, 'form-field-label')}>
        {format(`playbooks.${name}`)}
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
  const { user } = useUser()

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

  const slugNameMapping = (() => {
    const map = {}
    if (playbook) {
      map[playbook.slug] = playbook.name
    }

    map.edit = format('app.edit')
    map.create = format('app.create')

    return map
  })()

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
                {playbook && format('app.editEntity', { entity: playbook.name })}
                {!playbook && `${format('app.createNew')} ${format('ui.playbook.label')}`}
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/3 flex flex-col gap-y-3'>
                  <div className='form-field-wrapper' data-testid='playbook-name'>
                    <label className='form-field-label required-field' htmlFor='name'>
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
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('ui.playbook.cover')}
                    </label>
                    <FileUploader {...register('cover')} />
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('ui.playbook.author')}
                    </label>
                    <Input {...register('author')} placeholder={format('ui.playbook.author')} />
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('ui.playbook.tags')}
                    </label>
                    <TagAutocomplete
                      isSearch
                      tags={tags}
                      setTags={setTags}
                      placeholder={format('ui.playbook.form.tags')}
                      containerStyles='mb-2'
                    />
                    <div className='flex flex-wrap gap-3'>
                      <TagActiveFilters tags={tags} setTags={setTags} />
                    </div>
                  </div>
                </div>
                <div className='w-full lg:w-2/3' data-testid='playbook-overview'>
                  <FormTextEditor
                    control={control}
                    name='overview'
                    placeholder={format('ui.playbook.overview')}
                    required
                    isInvalid={errors.overview}
                  />
                </div>
              </div>
              <div className='flex flex-col lg:flex-row gap-x-4'>
                <div className='w-full lg:w-1/2'>
                  <FormTextEditor
                    control={control}
                    name='audience'
                    placeholder={format('ui.playbook.audience')}
                  />
                </div>
                <div className='w-full lg:w-1/2'>
                  <FormTextEditor
                    control={control}
                    name='outcomes'
                    placeholder={format('ui.playbook.outcomes')}
                  />
                </div>
              </div>
              <label className='flex gap-x-2 mb-2 items-center self-start form-field-label'>
                <Checkbox {...register(PUBLISHED_CHECKBOX_FIELD_NAME)} />
                {format('ui.playbook.published')}
              </label>
              <div className='flex font-semibold text-xl gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                  data-testid='submit-button'
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
          </form>
        </div>
      </div>
    </div>
  )
})

export default PlaybookForm
