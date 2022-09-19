import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { FaPlusCircle, FaSpinner } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import dynamic from 'next/dynamic'
import classNames from 'classnames'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlEditor } from '../shared/HtmlEditor'
import { SOURCE_TYPE_ASSIGNING } from '../plays/PlayList'
import { PlayListContext } from '../plays/PlayListContext'
import PlayListDraggable from '../plays/PlayListDraggable'
import { TagAutocomplete, TagFilters } from '../filter/element/Tag'
import { PlayFilterContext, PlayFilterDispatchContext } from '../context/PlayFilterContext'
import { ToastContext } from '../../lib/ToastContext'
import { SearchInput } from '../../components/shared/SearchInput'
import Checkbox from '../shared/Checkbox'
import Input from '../shared/Input'
import { AUTOSAVE_PLAYBOOK, CREATE_PLAYBOOK } from '../../mutations/playbook'
import ValidationError from '../shared/ValidationError'
import FileUploader from '../shared/FileUploader'
const PlayListQuery = dynamic(() => import('../plays/PlayList'), { ssr: false })

const PUBLISHED_CHECKBOX_FIELD_NAME = 'published'

const FormPlayList = ({ playbook, saveAndCreatePlay }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search, tags } = useContext(PlayFilterContext)
  const { setSearch, setTags } = useContext(PlayFilterDispatchContext)

  const [showPlayForm, setShowPlayForm] = useState(false)
  const handleChange = (e) => setSearch(e.target.value)

  return (
    <>
      <div className='flex flex-col gap-y-2 mt-4'>
        <div className='text-xl text-dial-blue font-bold'>
          {format('playbooks.plays')}
        </div>
        <div className='text-sm text-dial-blue'>
          {format('playbooks.assignedPlays')}
        </div>
        <PlayListDraggable playbook={playbook} />
      </div>
      {
        showPlayForm &&
          <div className='flex flex-col gap-3 mt-4'>
            <div className='flex flex-col gap-y-3'>
              <div className='flex flex-wrap gap-2'>
                <div className='text-sm text-dial-blue my-auto'>
                  {format('playbook.assignAnotherPlay')}
                </div>
                <span className='sr-only'>{format('search.input.label')}</span>
                <SearchInput
                  value={search}
                  onChange={handleChange}
                  className='w-56 2xl:w-96'
                  placeholder={`${format('app.search')} ${format('play.header')}`}
                />
                <TagAutocomplete
                  isSearch
                  tags={tags}
                  setTags={setTags}
                  containerStyles='w-56 2xl:w-96'
                />
              </div>
              <div className='flex flex-row flex-wrap gap-3'>
                <TagFilters tags={tags} setTags={setTags} />
              </div>
            </div>
            <PlayListQuery playbook={playbook} sourceType={SOURCE_TYPE_ASSIGNING} />
            <div className='flex'>
              <button className='flex gap-2' onClick={saveAndCreatePlay}>
                <FaPlusCircle className='ml-3 my-auto' color='#3f9edd' />
                <div className='text-dial-blue my-auto'>
                  {`${format('app.create-new')} ${format('plays.label')}`}
                </div>
              </button>
              <button
                type='button'
                className='ml-auto bg-button-gray-light text-white py-2 px-4 rounded'
                onClick={() => { setShowPlayForm(false) }}
              >
                {format('app.close')}
              </button>
            </div>
          </div>
      }
      {
        !showPlayForm &&
          <div className='font-semibold text-sm ml-auto'>
            <button
              type='button'
              className='bg-blue-500 text-dial-gray-light py-2 px-4 rounded'
              onClick={() => { setShowPlayForm(true) }}
            >
              {format('playbooks.assignPlay')}
            </button>
          </div>
      }
    </>
  )
}

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
  const { data: session } = useSession()

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)
  const [navigateToPlay, setNavigateToPlay] = useState(false)

  const { locale } = useRouter()
  const [updatePlaybook, { data }] = useMutation(CREATE_PLAYBOOK)
  const [autoSavePlaybook, { data: autoSaveData }] = useMutation(AUTOSAVE_PLAYBOOK)
  const { handleSubmit, register, control, watch, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: playbook && playbook.name,
      author: playbook && playbook.author,
      overview: playbook && playbook.playbookDescription.overview,
      audience: playbook && playbook.playbookDescription.audience,
      outcomes: playbook && playbook.playbookDescription.outcomes,
      published: playbook ? !playbook.draft : false
    }
  })
  const isPublished = watch(PUBLISHED_CHECKBOX_FIELD_NAME)

  const [slug] = useState(playbook ? playbook.slug : '')
  const [tags, setTags] = useState(playbook?.tags.map(tag => ({ label: tag, value: tag })) ?? [])

  const { showToast } = useContext(ToastContext)
  const { currentPlays } = useContext(PlayListContext)

  const notifyAndNavigateAway = useCallback(() => {
    if (!navigateToPlay) {
      showToast(format('playbook.submitted'), 'success', 'top-center')
      const navigateToPlaybook = setTimeout(() => {
        router.push(`/${router.locale}/playbooks/${data.createPlaybook.playbook.slug}`)
      }, 800)

      return () => clearTimeout(navigateToPlaybook)
    } else {
      showToast(format('playbook.submittedToCreatePlay'), 'success', 'top-center')
      const navigateToPlay = setTimeout(() => {
        router.push(`/${router.locale}/playbooks/${data.createPlaybook.playbook.slug}/plays/create`)
      }, 800)

      return () => clearTimeout(navigateToPlay)
    }
  }, [data, router, format, showToast, navigateToPlay])

  useEffect(() => {
    if (data?.createPlaybook?.errors.length === 0 && data?.createPlaybook?.playbook) {
      notifyAndNavigateAway()
    } else if (autoSaveData?.autoSavePlaybook?.errors.length === 0 && autoSaveData?.autoSavePlaybook?.playbook) {
      setMutating(false)
      showToast(format('playbook.autoSaved'), 'success', 'top-right')
    }
  }, [data, autoSaveData, notifyAndNavigateAway, showToast, format])

  const doUpsert = async (data) => {
    if (session) {
      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = session.user
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
        plays: currentPlays,
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
      if (session) {
        // Set the loading indicator.
        setMutating(true)
        // Pull all needed data from session and form.
        const { userEmail, userToken } = session.user
        const { name, author, overview, audience, outcomes } = watch()
        // Send graph query to the backend. Set the base variables needed to perform update.
        // Auto save will not save the cover file since it could be expensive.
        const variables = {
          name,
          slug,
          author,
          overview,
          audience,
          outcomes,
          plays: currentPlays,
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
    }

    const interval = setInterval(() => {
      if (slug) {
        doAutoSave()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [session, slug, currentPlays, tags, locale, watch, autoSavePlaybook])

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

  const saveAndCreatePlay = () => {
    setNavigateToPlay(true)
  }

  const savePlaybook = () => {
    setNavigateToPlay(false)
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
              <div className='text-2xl font-bold text-dial-blue pb-4'>
                {playbook && format('app.edit-entity', { entity: playbook.name })}
                {!playbook && `${format('app.create-new')} ${format('playbooks.label')}`}
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/3 flex flex-col gap-y-3'>
                  <div className='form-field-wrapper' data-testid='playbook-name'>
                    <label className='form-field-label required-field' htmlFor='name'>
                      {format('playbooks.name')}
                    </label>
                    <Input
                      {...register('name', { required: format('validation.required') })}
                      id='name'
                      placeholder={format('playbooks.name')}
                      isInvalid={errors.name}
                    />
                    {errors.name && <ValidationError value={errors.name?.message} />}
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('playbook.cover')}
                    </label>
                    <FileUploader {...register('cover')} />
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('playbook.author')}
                    </label>
                    <Input {...register('author')} placeholder={format('playbook.author')} />
                  </div>
                  <div className='form-field-wrapper'>
                    <label className='form-field-label'>
                      {format('playbooks.tags')}
                    </label>
                    <TagAutocomplete
                      isSearch
                      tags={tags}
                      setTags={setTags}
                      placeholder={format('playbook.form.tags')}
                      containerStyles='mb-2'
                    />
                    <div className='flex flex-wrap gap-3'>
                      <TagFilters tags={tags} setTags={setTags} />
                    </div>
                  </div>
                </div>
                <div className='w-full lg:w-2/3' data-testid='playbook-overview'>
                  <FormTextEditor
                    control={control}
                    name='overview'
                    placeholder={format('playbooks.overview')}
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
                    placeholder={format('playbooks.audience')}
                  />
                </div>
                <div className='w-full lg:w-1/2'>
                  <FormTextEditor
                    control={control}
                    name='outcomes'
                    placeholder={format('playbooks.outcomes')}
                  />
                </div>
              </div>
              <FormPlayList playbook={playbook} saveAndCreatePlay={saveAndCreatePlay} />
              <label className='flex gap-x-2 mb-2 items-center self-start form-field-label'>
                <Checkbox {...register(PUBLISHED_CHECKBOX_FIELD_NAME)} />
                {format('playbook.published')}
              </label>
              <div className='flex font-semibold text-xl gap-3'>
                <button
                  type='submit'
                  onClick={savePlaybook}
                  className='submit-button'
                  disabled={mutating || reverting}
                  data-testid='submit-button'
                >
                  {format(isPublished ? 'playbook.publish' : 'playbook.saveAsDraft')}
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
