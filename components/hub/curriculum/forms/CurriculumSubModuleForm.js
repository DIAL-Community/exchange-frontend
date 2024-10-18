import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaPlusCircle, FaSpinner } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { Loading, Unauthorized } from '../../../shared/FetchStatus'
import { HtmlEditor } from '../../../shared/form/HtmlEditor'
import Select from '../../../shared/form/Select'
import { AUTOSAVE_MOVE, CREATE_MOVE, CREATE_MOVE_RESOURCE } from '../../../shared/mutation/move'
import { RESOURCE_SEARCH_QUERY } from '../../../shared/query/resource'
import { fetchSelectOptions } from '../../../utils/search'
import { DPI_TENANT_NAME } from '../../constants'

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
            className='bg-dial-purple text-dial-cotton px-3 py-2 rounded disabled:opacity-50'
            disabled={mutating}
            onClick={saveForm}
          >
            {`${format('app.submit')} ${format('ui.resource.label')}`}
            {mutating && <FaSpinner className='spinner ml-3 inline' />}
          </button>
          <button
            type='button'
            className='bg-dial-purple-light text-dial-cotton px-3 py-2 rounded disabled:opacity-50'
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

  const client = useApolloClient()

  const router = useRouter()
  const { user, loadingUserSession } = useUser()
  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const [moveSlug, setMoveSlug] = useState(curriculumSubModule ? curriculumSubModule.slug : '')
  const [playSlug] = useState(curriculumModule.slug)
  const [inlineResources, setInlineResources] = useState(
    curriculumSubModule ? curriculumSubModule.inlineResources.map((resource, i) => ({ ...resource, i })) : []
  )

  const [resources, setResources] = useState(
    curriculumSubModule?.resources?.map(resource => ({
      id: resource.id,
      slug: resource.slug,
      name: resource.name,
      resourceLink: resource.resourceLink
    })) ?? []
  )

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)
  const [createMove, { reset }] = useMutation(CREATE_MOVE, {
    onCompleted: (data) => {
      setMutating(false)
      const { createMove: response } = data
      if (response?.errors.length === 0 && response.move) {
        setMutating(false)
        showSuccessMessage(
          format('hub.curriculum.submodule.submitted'),
          () => router.push(`/hub/curriculum/${curriculum.slug}`)
        )
      } else {
        const [ firstErrorMessage ] = response.errors
        showFailureMessage(firstErrorMessage)
        setMutating(false)
        reset()
      }
    },
    onError: (error) => {
      showFailureMessage('Unable to process graph query.', error?.message)
      setMutating(false)
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
        showSuccessMessage(format('hub.curriculum.submodule.autoSaved'))
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
      const { name, description } = data
      createMove({
        variables: {
          name,
          moveSlug,
          playSlug,
          owner: DPI_TENANT_NAME,
          description,
          inlineResources,
          resourceSlugs: resources.map((resource) => resource.slug)
        },
        context: {
          headers: {
            'Accept-Language': router.locale
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
        owner: DPI_TENANT_NAME,
        description,
        inlineResources,
        resourceSlugs: resources.map((resource) => resource.slug)
      }

      autoSaveMove({
        variables,
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }

    const interval = setInterval(() => {
      doAutoSave()
    }, 60000)

    return () => clearInterval(interval)
  }, [user, moveSlug, playSlug, inlineResources, resources, router, watch, autoSaveMove])

  const cancelForm = () => {
    setReverting(true)
    let route = '/hub/curriculum'
    if (curriculum) {
      route = `${route}/${curriculum.slug}`
    }

    router.push(route)
  }

  const fetchedResourcesCallback = (data) => (
    data.resources?.map((resource) => ({
      id: resource.id,
      name: resource.name,
      slug: resource.slug,
      label: resource.name,
      resourceLink: resource.resourceLink
    }))
  )

  const addResource = (resource) =>
    setResources([
      ...resources.filter(({ slug }) => slug !== resource.slug),
      { name: resource.label, slug: resource.slug, resourceLink: resource.resourceLink }
    ])

  const removeResource = (resource) =>
    setResources([...resources.filter(({ slug }) => slug !== resource.slug)])

  const loadResourceOptions = (input) =>
    fetchSelectOptions(client, input, RESOURCE_SEARCH_QUERY, fetchedResourcesCallback)

  const addInlineResource = (resource) => {
    setInlineResources([...inlineResources, resource])
  }

  const updateInlineResource = (index, resource) => {
    for (let i = 0; i < inlineResources.length; i++) {
      if (index !== i) {
        continue
      }

      const currentResource = inlineResources[i]
      currentResource.name = resource.name
      currentResource.description = resource.description
      currentResource.url = resource.url
    }

    setInlineResources([...inlineResources])
  }

  const removeInlineResource = (index, resource) => {
    setInlineResources(inlineResources.filter((r, i) => i !== index && r.name !== resource.name))
  }

  return loadingUserSession
    ? <Loading />
    : user?.isAdminUser || user?.isEditorUser || user?.isAdliAdminUser
      ? (
        <form onSubmit={handleSubmit(doUpsert)}>
          <div className='px-4 lg:px-0 py-4 lg:py-6'>
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
              <div className='flex flex-col gap-y-2'>
                <label className='flex flex-col gap-y-2'>
                  {format('ui.resource.header')}
                  <Select
                    async
                    isBorderless
                    defaultOptions
                    cacheOptions
                    placeholder={format('ui.resource.header')}
                    loadOptions={loadResourceOptions}
                    noOptionsMessage={() =>
                      format('filter.searchFor', { entity: format('ui.resource.header') })
                    }
                    onChange={addResource}
                    value={null}
                  />
                </label>
                <div className='flex flex-col gap-3 mt-2'>
                  {resources?.map((resource, resourceIdx) =>(
                    <div
                      key={resourceIdx}
                      className='shadow-md flex flex-col gap-1 px-2 py-1 bg-white text-dial-stratos'
                    >
                      <div className='flex gap-2'>
                        <div className='line-clamp-1'>{resource.name}</div>
                        <button className='ml-auto shrink-0' type='button' onClick={() => removeResource(resource)}>
                          <FaXmark className='text-dial-stratos' size='1rem' />
                        </button>
                      </div>
                      <div className='text-xs line-clamp-1 text-dial-deep-purple'>{resource.resourceLink}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex flex-col gap-y-3'>
                <div className='text-sm'>
                  {format('ui.resource.header')}
                </div>
                <div className='text-xs italic text-dial-stratos'>
                  {format('ui.move.assignedResources')}
                </div>
                <div className='flex flex-col gap-y-4'>
                  {inlineResources && inlineResources.map((resource, i) =>
                    <ResourceRenderer
                      key={i}
                      index={i}
                      moveSlug={moveSlug}
                      playSlug={playSlug}
                      resource={resource}
                      updateResource={updateInlineResource}
                      removeResource={removeInlineResource}
                    />
                  )}
                </div>
              </div>
              <button type='button' className='flex gap-2 text-dial-iris-blue' onClick={() => addInlineResource({})}>
                <FaPlusCircle className='my-auto text-dial-iris-blue' />
                <div className='text-dial-iris-blue'>
                  {`${format('app.createNew')} ${format('ui.resource.label')}`}
                </div>
              </button>
              <div className='flex flex-row gap-3 text-sm'>
                <button
                  type='submit'
                  className='submit-button'
                  disabled={mutating || reverting}
                >
                  {`${format('app.submit')} ${format('hub.curriculum.submodule.label')}`}
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
