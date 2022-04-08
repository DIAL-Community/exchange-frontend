import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { FaSpinner, FaPlusCircle } from 'react-icons/fa'
import { useSession } from 'next-auth/client'
import { HtmlEditor } from '../shared/HtmlEditor'
import { TagAutocomplete, TagFilters } from '../filter/element/Tag'
import Breadcrumb from '../shared/breadcrumb'
import { ToastContext } from '../../lib/ToastContext'
import MoveListDraggable from './moves/MoveListDraggable'

const generateMutationText = (mutationFunc) => {
  return `
    mutation (
      $name: String!,
      $slug: String!,
      $description: String!,
      $tags: JSON!,
      $playbookSlug: String
    ) {
      ${mutationFunc} (
        name: $name,
        slug: $slug,
        description: $description,
        tags: $tags,
        playbookSlug: $playbookSlug
      ) {
        play {
          id
          name
          slug
        }
        errors
      }
    }
  `
}

const CREATE_PLAY = gql(generateMutationText('createPlay'))
const AUTOSAVE_PLAY = gql(generateMutationText('autoSavePlay'))

const FormTextEditor = ({ control, name }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <label className='block text-xl text-dial-blue flex flex-col gap-y-2'>
      {format(`plays.${name}`)}
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <HtmlEditor
              editorId={`${name}-editor`}
              onBlur={onBlur}
              onChange={onChange}
              initialContent={value}
            />
          )
        }}
      />
    </label>
  )
}

export const PlayForm = ({ playbook, play }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id: id }, values), [formatMessage])

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)
  const [navigateToMove, setNavigateToMove] = useState(false)
  const [assigningToPlaybook, setAssigningToPlaybook] = useState(false)

  const [createPlay, { data }] = useMutation(CREATE_PLAY)
  const [autoSavePlay, { data: autoSaveData }] = useMutation(AUTOSAVE_PLAY)

  const router = useRouter()
  const [session] = useSession()
  const { showToast } = useContext(ToastContext)

  const [slug] = useState(play ? play.slug : '')
  const [tags, setTags] = useState(
    play ? play.tags.map(tag => { return { label: tag, value: tag } }) : []
  )

  const { handleSubmit, register, control, watch } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: play && play.name,
      description: play && play.playDescription?.description
    }
  })

  useEffect(() => {
    const { locale } = router
    if (data && data.createPlay.errors.length === 0 && data.createPlay.play) {
      setMutating(false)
      if (!navigateToMove) {
        showToast(format('play.submitted'), 'success', 'top-center')
        const navigateToPlay = setTimeout(() => {
          router.push(`/${locale}/playbooks/${playbook.slug}/edit`)
        }, 800)

        return () => clearTimeout(navigateToPlay)
      } else {
        showToast(format('play.submittedToCreateMove'), 'success', 'top-center')
        const navigateToMove = setTimeout(() => {
          router.push(`/${locale}/playbooks/${playbook.slug}/plays/${data.createPlay.play.slug}/moves/create`)
        }, 800)

        return () => clearTimeout(navigateToMove)
      }
    } else if (autoSaveData?.autoSavePlay?.errors.length === 0 && autoSaveData?.autoSavePlay?.play) {
      setMutating(false)
      showToast(format('play.autoSaved'), 'success', 'top-right')
    }
  }, [data, autoSaveData, playbook, navigateToMove, router, showToast, format])

  const doUpsert = async (data) => {
    if (session) {
      setMutating(true)

      const { userEmail, userToken } = session.user
      const { name, description } = data
      const variables = {
        name,
        slug,
        description,
        tags: tags.map(tag => tag.label),
        playbookSlug: ''
      }

      if (assigningToPlaybook) {
        variables.playbookSlug = playbook.slug
      }

      createPlay({
        variables,
        context: {
          headers: {
            'Accept-Language': router.locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  useEffect(() => {
    const doAutoSave = () => {
      const { locale } = router
      if (session) {
        // Set the loading indicator.
        setMutating(true)
        // Pull all needed data from session and form.
        const { userEmail, userToken } = session.user
        const { name, description } = watch()
        // Send graph query to the backend. Set the base variables needed to perform update.
        const variables = {
          name,
          slug,
          description,
          tags: tags.map(tag => tag.label)
        }
        autoSavePlay({
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
  }, [session, slug, tags, router, watch, autoSavePlay])

  const cancelForm = () => {
    setReverting(true)
    const route = `/${router.locale}/playbooks/${playbook.slug}/edit`
    router.push(route)
  }

  const slugNameMapping = (() => {
    const map = {}
    if (play) {
      map[play.slug] = play.name
    }

    map[playbook.slug] = playbook.name
    map.edit = format('app.edit')
    map.create = format('app.create')

    return map
  })()

  const saveAndCreateMove = () => {
    setNavigateToMove(true)
    setAssigningToPlaybook(false)
  }

  const savePlay = () => {
    setNavigateToMove(false)
    setAssigningToPlaybook(false)
  }

  const saveAndAssignPlay = () => {
    setNavigateToMove(false)
    setAssigningToPlaybook(true)
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
                {play && format('app.edit-entity', { entity: play.name })}
                {!play && `${format('app.create-new')} ${format('plays.label')}`}
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/3 flex flex-col gap-y-3'>
                  <label className='flex flex-col gap-y-2 text-xl text-dial-blue mb-2'>
                    {format('plays.name')}
                    <input
                      {...register('name', { required: true })}
                      className='shadow border-1 rounded w-full py-2 px-3'
                    />
                  </label>
                  <div className='flex flex-col gap-y-2'>
                    <label className='text-xl text-dial-blue' htmlFor='name'>
                      {format('plays.tags')}
                      <TagAutocomplete {...{ tags, setTags }} controlSize='100%' placeholder={format('play.form.tags')} />
                    </label>
                    <div className='flex flex-wrap gap-1'>
                      <TagFilters {...{ tags, setTags }} />
                    </div>
                  </div>
                </div>
                <div className='w-full lg:w-2/3' style={{ minHeight: '20rem' }}>
                  <FormTextEditor control={control} name='description' />
                </div>
              </div>
              <div className='flex flex-col gap-y-2 mt-4'>
                <div className='text-xl text-dial-blue font-bold'>
                  {format('move.header')}
                </div>
                <div className='text-sm text-dial-blue'>
                  {format('play.assignedMoves')}
                </div>
                <MoveListDraggable playbook={playbook} play={play} />
              </div>
              <div className='block'>
                <button className='flex gap-2' onClick={saveAndCreateMove}>
                  <FaPlusCircle className='ml-3 my-auto' color='#3f9edd' />
                  <div className='text-dial-blue'>{`${format('app.create-new')} ${format('move.label')}`}</div>
                </button>
              </div>
              <div className='flex font-semibold text-xl lg:mt-8 gap-3'>
                <button
                  type='submit'
                  onClick={savePlay}
                  className='bg-blue-500 text-dial-gray-light py-3 px-8 rounded disabled:opacity-50'
                  disabled={mutating || reverting}
                >
                  {`${format('app.submit')} ${format('plays.label')}`}
                  {mutating && <FaSpinner className='spinner ml-3 inline' />}
                </button>
                <button
                  type='submit'
                  onClick={saveAndAssignPlay}
                  className='bg-blue-500 text-dial-gray-light py-3 px-8 rounded disabled:opacity-50'
                  disabled={mutating || reverting}
                >
                  {`${format('play.submitAndAssign')} ${format('plays.label')}`}
                  {mutating && <FaSpinner className='spinner ml-3 inline' />}
                </button>
                <button
                  type='button'
                  className='bg-button-gray-light text-white py-3 px-8 rounded disabled:opacity-50'
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
}
