import { memo, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import GeocodeAutocomplete from '../../shared/form/GeocodeAutocomplete'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import Input from '../../shared/form/Input'
import Pill from '../../shared/form/Pill'
import UrlInput from '../../shared/form/UrlInput'
import ValidationError from '../../shared/form/ValidationError'
import { CREATE_PROJECT } from '../../shared/mutation/project'
import { PAGINATED_PROJECTS_QUERY, PROJECT_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/project'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

const ProjectForm = memo(({ project }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [location, setLocation] = useState()
  const [locationName, setLocationName] = useState(project.location)

  const slug = project?.slug ?? ''
  const countrySlugs = project?.countries.map(c => c.slug) ?? []

  const [mutating, setMutating] = useState(false)
  const [reverting, setReverting] = useState(false)

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const router = useRouter()
  const { locale } = router

  const LOCATION_NAME_PARTS_SEPARATOR = ', '
  const addLocation = (locationToAdd) => {
    if (locationToAdd) {
      const { cityName, regionName, countryCode, latitude, longitude } = locationToAdd
      const location = {
        name: [cityName, regionName, countryCode].join(LOCATION_NAME_PARTS_SEPARATOR),
        cityName,
        regionName,
        countryCode,
        latitude,
        longitude
      }
      setLocation(location)
      setLocationName(location.name)
    }
  }

  const removeLocation = () => {
    setLocation(null)
    setLocationName('')
  }

  const [updateProject, { reset }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{
      query: PROJECT_PAGINATION_ATTRIBUTES_QUERY,
      variables: { search: '' },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }, {
      query: PAGINATED_PROJECTS_QUERY,
      variables: { search: '', limit: DEFAULT_PAGE_SIZE, offset: 0 },
      context: {
        headers: {
          ...GRAPH_QUERY_CONTEXT.VIEWING
        }
      }
    }],
    onCompleted: (data) => {
      if (data.createProject.project && data.createProject.errors.length === 0) {
        setMutating(false)
        const redirectPath = `/${locale}/projects/${data.createProject.project.slug}`
        const redirectHandler = () => router.push(redirectPath)
        showSuccessMessage(
          format('toast.submit.success', { entity: format('ui.project.label') }),
          redirectHandler
        )
      } else {
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.project.label') }))
        setMutating(false)
        reset()
      }
    },
    onError: () => {
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.project.label') }))
      setMutating(false)
      reset()
    }
  })

  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      name: project?.name,
      aliases: project?.aliases?.length ? project?.aliases.map((value) => ({ value })) : [{ value: '' }],
      projectUrl: project?.projectWebsite,
      description: project?.projectDescription?.description
    }
  })

  const doUpsert = async (data) => {
    // Set the loading indicator.
    setMutating(true)
    // Pull all needed data from session and form.
    const {
      name,
      imageFile,
      projectUrl,
      description
    } = data
    // Send graph query to the backend. Set the base variables needed to perform update.
    const variables = {
      name,
      slug,
      projectUrl,
      description,
      location,
      countrySlugs
    }
    if (imageFile) {
      variables.imageFile = imageFile[0]
    }

    updateProject({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const cancelForm = () => {
    setReverting(true)
    router.push(`/${locale}/projects/${slug}`)
  }

  return (
    <form onSubmit={handleSubmit(doUpsert)}>
      <div className='px-4 lg:px-0 py-4 lg:py-6 text-dial-plum'>
        <div className='flex flex-col gap-y-6 text-sm'>
          <div className='text-xl font-semibold'>
            {project
              ? format('app.editEntity', { entity: project.name })
              : `${format('app.createNew')} ${format('ui.project.label')}`}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label className='required-field' htmlFor='name'>
              {format('project.name')}
            </label>
            <Input
              {...register('name', { required: format('validation.required') })}
              id='name'
              placeholder={format('project.name')}
              isInvalid={errors.name}
            />
            {errors.name && <ValidationError value={errors.name?.message} />}
          </div>
          <div className='flex flex-col gap-y-2'>
            <label htmlFor='projectUrl'>
              {format('project.url')}
            </label>
            <Controller
              id='projectUrl'
              name='projectUrl'
              control={control}
              render={({ field: { value, onChange } }) => (
                <UrlInput value={value} onChange={onChange} id='projectUrl' placeholder={format('project.url')} />
              )}
            />
          </div>
          <div className='flex flex-col gap-y-2'>
            <label id='description' className='required-field'>
              {format('project.description')}
            </label>
            <Controller
              name='description'
              control={control}
              render={({ field: { value, onChange } }) => (
                <HtmlEditor
                  labelledBy='description'
                  onChange={onChange}
                  initialContent={value}
                  placeholder={format('project.description')}
                />
              )}
              rules={{ required: format('validation.required') }}
            />
            {errors.description && <ValidationError value={errors.description?.message} />}
          </div>
          <div className='flex flex-col gap-y-3'>
            <label className='flex flex-col gap-y-2 mb-2'>
              {`${format('app.searchAndAssign')} ${format('project.location')}`}
              <GeocodeAutocomplete
                value={null}
                onChange={addLocation}
              />
            </label>
          </div>
          <div className='flex flex-wrap gap-3'>
            { locationName &&
              <Pill
                label={locationName}
                onRemove={() => removeLocation()}
              />
            }
          </div>
          <div className='flex flex-wrap text-base mt-6 gap-3'>
            <button type='submit' className='submit-button' disabled={mutating || reverting}>
              {`${format('app.submit')} ${format('ui.project.label')}`}
              {mutating && <FaSpinner className='spinner ml-3' />}
            </button>
            <button type='button' className='cancel-button' disabled={mutating || reverting} onClick={cancelForm}>
              {format('app.cancel')}
              {reverting && <FaSpinner className='spinner ml-3' />}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
})

ProjectForm.displayName = 'ProjectForm'

export default ProjectForm
