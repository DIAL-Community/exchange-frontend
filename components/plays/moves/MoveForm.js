import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { FaPlusCircle, FaSpinner } from 'react-icons/fa'
import { HtmlEditor } from '../../shared/HtmlEditor'
import Breadcrumb from '../../shared/breadcrumb'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'

const CREATE_RESOURCE = gql`
  mutation (
    $playSlug: String!,
    $moveSlug: String!,
    $url: String!,
    $name: String!,
    $description: String!,
    $index: Int!
  ) {
    createResource(
      playSlug: $playSlug,
      moveSlug: $moveSlug,
      url: $url,
      name: $name,
      description: $description,
      index: $index
    ) {
      move {
        id
        name
        slug
      }
      errors
    }
  }
`
const generateMutationText = (mutationFunc) => {
  return `
    mutation (
      $playSlug: String!,
      $moveSlug: String!,
      $name: String!,
      $description: String!,
      $resources: JSON!
    ) {
      ${mutationFunc} (
        playSlug: $playSlug,
        moveSlug: $moveSlug,
        name: $name,
        description: $description,
        resources: $resources
      ) {
        move {
          id
          name
          slug
          play {
            slug
          }
        }
        errors
      }
    }
  `
}

const CREATE_MOVE = gql(generateMutationText('createMove'))
const AUTOSAVE_MOVE = gql(generateMutationText('autoSaveMove'))

const ResourceFormEditor = ({ index, moveSlug, playSlug, resource, updateResource, removeResource, setEditing }) => {
  const [mutating, setMutating] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { locale } = useRouter()
  const [createResource, { data }] = useMutation(CREATE_RESOURCE)
  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (data && data.createResource.errors.length === 0 && data.createResource.move) {
      setEditing(false)
      setMutating(false)
      showToast(format('resource.submitted'), 'success', 'top-center')
    }
  }, [data, setEditing, showToast, setMutating, format])

  const { handleSubmit, register } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: resource && resource.name,
      resourceDescription: resource && resource.description,
      url: resource && resource.url
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)

      const { userEmail, userToken } = user
      const { name, resourceDescription, url } = data

      updateResource(index, { name, description: resourceDescription, url })
      if (moveSlug) {
        createResource({
          variables: {
            playSlug,
            moveSlug,
            url,
            name,
            description: resourceDescription,
            index
          },
          context: {
            headers: {
              'Accept-Language': locale,
              Authorization: `${userEmail} ${userToken}`
            }
          }
        })
      }
    }
  }

  const saveForm = () => {
    handleSubmit(doUpsert)()
  }

  const cancelForm = () => {
    setEditing(false)
    if (Object.keys(resource).length <= 0) {
      removeResource(index, resource)
    }
  }

  return (
    <div className='flex flex-col border-b border-t py-3 px-3'>
      <div className='flex flex-col lg:flex-row gap-4 text-sm'>
        <div className='w-full lg:w-1/3 flex flex-col gap-y-3'>
          <label className='flex flex-col gap-y-2 mb-2'>
            {format('resource.name')}
            <input
              {...register('name', { required: true })}
              className='shadow border-1 rounded w-full py-2 px-3'
            />
          </label>
          <label className='flex flex-col gap-y-2 mb-2'>
            {format('resource.url')}
            <input
              {...register('url', { required: true })}
              className='shadow border-1 rounded w-full py-2 px-3'
            />
          </label>
        </div>
        <div className='w-full lg:w-2/3'>
          <label className='flex flex-col gap-y-2 mb-2'>
            {format('resource.description')}
            <textarea
              {...register('resourceDescription', { required: true })}
              className='shadow border-1 rounded w-full py-2 px-3'
              rows={4}
            />
          </label>
        </div>
      </div>
      <div className='flex font-semibold lg:mt-8 gap-3 text-sm'>
        <button
          type='button'
          className='bg-dial-purple text-white px-3 py-2 rounded disabled:opacity-50'
          disabled={mutating}
          onClick={saveForm}
        >
          {`${format('app.submit')} ${format('resource.label')}`}
          {mutating && <FaSpinner className='spinner ml-3 inline' />}
        </button>
        <button
          type='button'
          className='bg-dial-purple-light text-white px-3 py-2 rounded disabled:opacity-50'
          disabled={mutating}
          onClick={cancelForm}
        >
          {format('app.cancel')}
        </button>
      </div>
    </div>
  )
}

const ResourceViewer = ({ index, resource, removeResource, setEditing }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-row gap-3 px-3'>
      <div className='py-3 font-semibold my-auto'>{index + 1})</div>
      <div className='bg-white border border-dial-gray border-opacity-50 card-drop-shadow w-full'>
        <div className='flex gap-4 px-3 py-3 w-full'>
          <div className='w-3/12 font-semibold my-auto overflow-hidden text-ellipsis'>
            {resource.name}
          </div>
          <div className='w-4/12 my-auto overflow-hidden text-ellipsis whitespace-nowrap'>
            {resource.description}
          </div>
          <div className='w-3/12 my-auto overflow-hidden text-ellipsis whitespace-nowrap'>
            {resource.url}
          </div>
          <div className='w-2/12 my-auto flex gap-2 text-sm'>
            <button
              type='button'
              className='ml-auto bg-dial-orange-light text-dial-purple py-1.5 px-3 rounded disabled:opacity-50'
              onClick={() => setEditing(true)}
            >
              {format('app.edit')}
            </button>
            <button
              type='button'
              className='bg-dial-blue text-dial-gray-light py-1.5 px-3 rounded disabled:opacity-50'
              onClick={() => removeResource(index, resource)}
            >
              {format('app.delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ResourceRenderer = (props) => {
  const [editing, setEditing] = useState(false)
  const { resource } = props

  useEffect(() => {
    if (Object.keys(resource).length <= 0) {
      setEditing(true)
    }
  }, [setEditing, resource])

  return (
    <>
      {!editing && <ResourceViewer {...{ ...props, setEditing }} />}
      {editing && <ResourceFormEditor {...{ ...props, setEditing }} />}
    </>
  )
}

const FormTextEditor = ({ control, fieldLabel, fieldName }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <label className='block text-dial-sapphire flex flex-col gap-y-2'>
      {format(fieldLabel)}
      <Controller
        name={fieldName}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <HtmlEditor
              editorId={`${fieldName}-editor`}
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

export const MoveForm = ({ playbook, play, move }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { user } = useUser()
  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const [moveSlug] = useState(move ? move.slug : '')
  const [playSlug] = useState(play ? play.slug : move ? move.play.slug : '')
  const [resources, setResources] = useState(
    move ? move.resources.map((resource, i) => ({ ...resource, i })) : []
  )
  const [createMove, { data }] = useMutation(CREATE_MOVE)
  const [autoSaveMove, { data: autoSaveData }] = useMutation(AUTOSAVE_MOVE)
  const { showToast } = useContext(ToastContext)

  const { handleSubmit, register, control, watch } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: move && move.name,
      description: move && move.moveDescription?.description
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)

      const { userEmail, userToken } = user
      const { name, description } = data

      createMove({
        variables: {
          moveSlug,
          playSlug,
          name,
          description,
          resources
        },
        context: {
          headers: {
            'Accept-Language': router.locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const slugNameMapping = (() => {
    const map = {}
    if (play) {
      map[play.slug] = play.name
    }

    if (playbook) {
      map[playbook.slug] = playbook.name
    }

    if (move) {
      map[move.play.slug] = move.play.name
      map[move.slug] = move.name
    }

    map.edit = format('app.edit')
    map.create = format('app.create')

    return map
  })()

  useEffect(() => {
    const { locale } = router
    if (data && data.createMove.errors.length === 0 && data.createMove.move) {
      setMutating(false)
      showToast(format('move.submitted'), 'success', 'top-center')
      const navigateToPlay = setTimeout(() => {
        router.push(`/${locale}/playbooks/${playbook.slug}/plays/${play.slug}/edit`)
      }, 2000)

      return () => clearTimeout(navigateToPlay)
    } else if (autoSaveData?.autoSaveMove?.errors.length === 0 && autoSaveData?.autoSaveMove?.move) {
      setMutating(false)
      showToast(format('move.autoSaved'), 'success', 'top-right')
    }
  }, [data, autoSaveData, play, playbook, router, showToast, format])

  useEffect(() => {
    const doAutoSave = () => {
      const { locale } = router
      if (user) {
        // Set the loading indicator.
        setMutating(true)
        // Pull all needed data from session and form.
        const { userEmail, userToken } = user
        const { name, description } = watch()
        // Send graph query to the backend. Set the base variables needed to perform update.
        const variables = {
          moveSlug,
          playSlug,
          name,
          description,
          resources
        }
        autoSaveMove({
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
      if (moveSlug) {
        doAutoSave()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [user, moveSlug, playSlug, resources, router, watch, autoSaveMove])

  const cancelForm = () => {
    setReverting(true)
    const route = `/${router.locale}/playbooks/${playbook.slug}/plays/${play.slug}/edit`
    router.push(route)
  }

  const addResource = (resource) => {
    setResources([...resources, resource])
  }

  const updateResource = (index, resource) => {
    for (let i = 0; i < resources.length; i++) {
      if (index !== i) {
        continue
      }

      const currentResource = resources[i]
      currentResource.name = resource.name
      currentResource.description = resource.description
      currentResource.url = resource.url
    }

    setResources([...resources])
  }

  const removeResource = (index, resource) => {
    setResources(resources.filter((r, i) => i !== index && r.name !== resource.name))
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
              <div className='text-2xl font-semibold text-dial-sapphire pb-4'>
                {move && format('app.edit-entity', { entity: move.name })}
                {!move && `${format('app.create-new')} ${format('move.label')}`}
              </div>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='w-full lg:w-1/3 flex flex-col gap-y-3'>
                  <label className='flex flex-col gap-y-2 text-dial-sapphire mb-2'>
                    {format('plays.name')}
                    <input
                      {...register('name', { required: true })}
                      className='shadow border-1 rounded w-full py-2 px-3'
                    />
                  </label>
                </div>
                <div className='w-full lg:w-2/3' style={{ minHeight: '20rem' }}>
                  <FormTextEditor control={control} fieldLabel='plays.description' fieldName='description' />
                </div>
              </div>
              <div className='flex flex-col gap-y-2 mt-4'>
                <div className='text-dial-sapphire font-bold'>
                  {format('resource.header')}
                </div>
                <div className='text-sm text-dial-blue'>
                  {format('move.assignedResources')}
                </div>
                {
                  resources && resources.map((resource, i) =>
                    <div key={i}>
                      <ResourceRenderer index={i} {...{ moveSlug, playSlug, resource, updateResource, removeResource }} />
                    </div>
                  )
                }
              </div>
              <div className='block'>
                <button type='button' className='flex gap-2' onClick={() => addResource({})}>
                  <FaPlusCircle className='ml-3 my-auto' color='#3f9edd' />
                  <div className='text-dial-blue'>{`${format('app.create-new')} ${format('resource.label')}`}</div>
                </button>
              </div>
              <div className='flex font-semibold text-xl lg:mt-8 gap-3'>
                <button
                  type='submit'
                  className='bg-blue-500 text-dial-gray-light py-3 px-8 rounded disabled:opacity-50'
                  disabled={mutating || reverting}
                >
                  {`${format('app.submit')} ${format('move.label')}`}
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
