import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaPlusCircle, FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { DEFAULT_AUTO_CLOSE_DELAY, ToastContext } from '../../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../../shared/FetchStatus'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import { AUTOSAVE_MOVE, CREATE_MOVE, CREATE_MOVE_RESOURCE } from '../../../shared/mutation/move'

const ResourceFormEditor = ({ index, moveSlug, playSlug, resource, updateResource, removeResource, setEditing }) => {
  const [mutating, setMutating] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [createMoveResource, { reset }] = useMutation(CREATE_MOVE_RESOURCE, {
    onCompleted: (data) => {
      const { createMoveResource: response } = data
      if (response.errors.length === 0 && response.move) {
        setEditing(false)
        setMutating(false)
        showToast(format('toast.products.update.success'), 'success', 'top-center')
      } else {
        setEditing(false)
        setMutating(false)
        showToast(format('ui.resource.submitted'), 'success', 'top-center')
        reset()
      }
    },
    onError: () => {
      setEditing(false)
      setMutating(false)
      showToast(format('ui.resource.submitted'), 'success', 'top-center')
      reset()
    }
  })

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
        createMoveResource({
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
    <div className='flex flex-col py-3 px-3'>
      <div className='flex flex-col gap-4 text-sm'>
        <hr className='border-b border-dial-slate-300'/>
        <label className='flex flex-col gap-y-2 mb-2'>
          {format('ui.resource.name')}
          <input
            {...register('name', { required: true })}
            className='shadow border-1 rounded w-full py-2 px-3'
          />
        </label>
        <label className='flex flex-col gap-y-2 mb-2'>
          {format('ui.resource.url')}
          <input
            {...register('url', { required: true })}
            className='shadow border-1 rounded w-full py-2 px-3'
          />
        </label>
        <label className='flex flex-col gap-y-2 mb-2'>
          {format('ui.resource.description')}
          <textarea
            {...register('resourceDescription', { required: true })}
            className='shadow border-1 rounded w-full py-2 px-3'
            rows={4}
          />
        </label>
        <div className='flex flex-row gap-3'>
          <button
            type='button'
            className='bg-dial-purple text-white px-3 py-2 rounded disabled:opacity-50'
            disabled={mutating}
            onClick={saveForm}
          >
            {`${format('app.submit')} ${format('ui.resource.label')}`}
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
        <hr className='border-b border-dial-slate-300'/>
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
      <div className='bg-dial-violet w-full'>
        <div className='flex flex-col gap-2 px-3 py-3'>
          <div className='basis-3/12 font-semibold my-auto line-clamp-1'>
            {resource.name}
          </div>
          <div className='line-clamp-1'>
            {resource.description}
          </div>
          <div className='line-clamp-1'>
            {resource.url}
          </div>
          <div className='ml-auto flex gap-2 text-sm'>
            <button
              type='button'
              className='bg-dial-iris-blue py-1.5 px-3 rounded'
              onClick={() => setEditing(true)}
            >
              {format('app.edit')}
            </button>
            <button
              type='button'
              className='bg-red-500 py-1.5 px-3 rounded'
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
    <label className='flex flex-col gap-y-2'>
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

const CurriculumSubModuleForm = ({ curriculum, curriculumModule, curriculumSubModule }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { user, loadingUserSession } = useUser()
  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const [moveSlug, setMoveSlug] = useState(curriculumSubModule ? curriculumSubModule.slug : '')
  const [playSlug] = useState(
    curriculumModule
      ? curriculumModule.slug
      : curriculumSubModule
        ? curriculumSubModule.play.slug
        : '')
  const [resources, setResources] = useState(
    curriculumSubModule ? curriculumSubModule.resources.map((resource, i) => ({ ...resource, i })) : []
  )

  const { showToast } = useContext(ToastContext)
  const [createMove, { reset }] = useMutation(CREATE_MOVE, {
    onCompleted: (data) => {
      setMutating(false)
      const { createMove: response } = data
      if (response?.errors.length === 0 && response.move) {
        showToast(
          format('ui.move.submitted.success'),
          'success',
          'top-center',
          DEFAULT_AUTO_CLOSE_DELAY,
          null,
          () => router.push(`/dpi-curriculum/${curriculum.slug}`)
        )
      } else {
        setMutating(false)
        showToast(
          <div className='flex flex-col'>
            <span>{response.errors}</span>
          </div>,
          'error',
          'top-center'
        )
        reset()
      }
    },
    onError: (error) => {
      setMutating(false)
      showToast(
        <div className='flex flex-col'>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center'
      )
      reset()
    }
  })

  const [autoSaveMove, { reset: resetAutoSave }] = useMutation(AUTOSAVE_MOVE, {
    onError: () => {
      setMutating(false)
      resetAutoSave()
    },
    onCompleted: (data) => {
      const { autoSaveMove: response } = data
      if (response.errors.length === 0 && response.move) {
        setMutating(false)
        setMoveSlug(response.move.slug)
        showToast(format('ui.move.autoSaved'), 'success', 'top-right')
      }
    }
  })

  const { handleSubmit, register, control, watch } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: curriculumSubModule && curriculumSubModule.name,
      description: curriculumSubModule && curriculumSubModule.moveDescription?.description
    }
  })

  const doUpsert = async (data) => {
    if (user) {
      setMutating(true)

      const { userEmail, userToken } = user
      const { name, description } = data

      createMove({
        variables: {
          name,
          moveSlug,
          playSlug,
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

  useEffect(() => {
    const doAutoSave = () => {
      const { locale } = router

      if (!user || !watch) {
        return
      }

      // Set the loading indicator.
      setMutating(true)
      // Pull all needed data from session and form.
      const { userEmail, userToken } = user
      const { name, description } = watch()
      if (!name || !description) {
        // Minimum required fields are name and description.
        setMutating(false)

        return
      }

      // Send graph query to the backend. Set the base variables needed to perform update.
      const variables = {
        name,
        moveSlug,
        playSlug,
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

    const interval = setInterval(() => {
      doAutoSave()
    }, 60000)

    return () => clearInterval(interval)
  }, [user, moveSlug, playSlug, resources, router, watch, autoSaveMove])

  const cancelForm = () => {
    setReverting(true)
    const route = `/dpi-curriculum/${curriculum.slug}`
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

  return loadingUserSession
    ? <Loading />
    : user?.isAdminUser || user?.isEditorUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='text-xl font-semibold'>
                {curriculumSubModule && format('app.editEntity', { entity: curriculumSubModule.name })}
                {!curriculumSubModule && `${format('app.createNew')} ${format('ui.move.label')}`}
              </div>
              <label className='flex flex-col gap-y-2'>
                {format('ui.play.name')}
                <input
                  {...register('name', { required: true })}
                  className='shadow border-1 rounded w-full py-2 px-3'
                />
              </label>
              <FormTextEditor
                control={control}
                fieldLabel='ui.move.description'
                fieldName='description'
              />
              <div className='flex flex-col gap-y-3'>
                <div className='text-sm'>
                  {format('ui.resource.header')}
                </div>
                <div className='text-xs italic text-dial-stratos'>
                  {format('ui.move.assignedResources')}
                </div>
                <div className='flex flex-col gap-y-4'>
                  {resources && resources.map((resource, i) =>
                    <ResourceRenderer
                      key={i}
                      index={i}
                      moveSlug={moveSlug}
                      playSlug={playSlug}
                      resource={resource}
                      updateResource={updateResource}
                      removeResource={removeResource}
                    />
                  )}
                </div>
              </div>
              <button type='button' className='flex gap-2 text-dial-iris-blue' onClick={() => addResource({})}>
                <FaPlusCircle className='my-auto text-dial-iris-blue' />
                <div className='text-dial-iris-blue'>
                  {`${format('app.createNew')} ${format('ui.resource.label')}`}
                </div>
              </button>
              <div className='flex flex-row gap-3'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                >
                  {`${format('app.submit')} ${format('ui.move.label')}`}
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
}

export default CurriculumSubModuleForm
