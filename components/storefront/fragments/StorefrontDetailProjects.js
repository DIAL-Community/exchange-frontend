import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import ProjectCard from '../../project/ProjectCard'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { handleLoadingQuery } from '../../shared/GraphQueryHandler'
import { UPDATE_ORGANIZATION_PROJECTS } from '../../shared/mutation/organization'
import { CREATE_STARRED_OBJECT, REMOVE_STARRED_OBJECT } from '../../shared/mutation/starredObject'
import { PROJECT_SEARCH_QUERY } from '../../shared/query/project'
import { STARRED_OBJECT_SEARCH_QUERY } from '../../shared/query/starredObject'
import { DisplayType, ObjectType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const StorefrontDetailProjects = ({ organization, editingAllowed, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [stars, setStars] = useState([])
  const [projects, setProjects] = useState(organization.projects)
  const [isDirty, setIsDirty] = useState(false)

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOrganizationProjects, { loading: loadingMutation, reset }] = useMutation(
    UPDATE_ORGANIZATION_PROJECTS, {
      onError: () => {
        setIsDirty(false)
        setProjects(organization?.projects)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.project.header') }))
        reset()
      },
      onCompleted: (data) => {
        const { updateOrganizationProjects: response } = data
        if (response?.organization && response?.errors?.length === 0) {
          setIsDirty(false)
          setProjects(response?.organization?.projects)
          showSuccessMessage(format('toast.submit.success', { entity: format('ui.project.header') }))
        } else {
          setIsDirty(false)
          setProjects(organization?.projects)
          showFailureMessage(format('toast.submit.failure', { entity: format('ui.project.header') }))
          reset()
        }
      }
    }
  )

  const [removeStarredObject, { reset: resetRemoveStarredObject }] = useMutation(
    REMOVE_STARRED_OBJECT, {
      onError: () => {
        showFailureMessage(format('ui.starredObject.removeFailure', { entity: format('ui.project.label') }))
        resetRemoveStarredObject()
      },
      onCompleted: (data) => {
        const { removeStarredObject: response } = data
        if (response?.starredObject && response?.errors?.length === 0) {
          setStars(stars => [...stars.filter(star => star !== response?.starredObject.starredObjectValue)])
          showSuccessMessage(format('ui.starredObject.removeSuccess', { entity: format('ui.project.label') }))
        } else {
          showFailureMessage(format('ui.starredObject.removeFailure', { entity: format('ui.project.label') }))
          resetRemoveStarredObject()
        }
      }
    }
  )

  const [createStarredObject, { reset: resetCreateStarredObject }] = useMutation(
    CREATE_STARRED_OBJECT, {
      onError: () => {
        showFailureMessage(format('ui.starredObject.createFailure', { entity: format('ui.project.label') }))
        resetCreateStarredObject()
      },
      onCompleted: (data) => {
        const { createStarredObject: response } = data
        if (response?.starredObject && response?.errors?.length === 0) {
          setStars(stars => [...stars, response?.starredObject.starredObjectValue])
          showSuccessMessage(format('ui.starredObject.createSuccess', { entity: format('ui.project.label') }))
        } else {
          showFailureMessage(format('ui.starredObject.createFailure', { entity: format('ui.project.label') }))
          resetCreateStarredObject()
        }
      }
    }
  )

  const { loading: loadingStarred } = useQuery(STARRED_OBJECT_SEARCH_QUERY, {
    variables: {
      sourceObjectType: ObjectType.ORGANIZATION,
      sourceObjectValue: organization.id
    },
    onCompleted: (data) => {
      const { starredObjects } = data
      setStars(stars => [
        ...stars,
        ...starredObjects.map(starredObject => starredObject.starredObjectValue)
      ])
    }
  })

  if (loadingStarred) {
    return handleLoadingQuery()
  }

  const fetchedProjectsCallback = (data) => (
    data.projects?.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      label: project.name
    }))
  )

  const addProject = (project) => {
    setProjects([
      ...[
        ...projects.filter(({ id }) => id !== project.id),
        { id: project.id, name: project.name, slug: project.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeProject = (project) => {
    setProjects([...projects.filter(({ id }) => id !== project.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    updateOrganizationProjects({
      variables: {
        projectSlugs: projects.map(({ slug }) => slug),
        slug: organization.slug
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const onCancel = () => {
    setProjects(organization.projects)
    setIsDirty(false)
  }

  const addStarHandler = (project) => {
    createStarredObject({
      variables: {
        starredObjectType: ObjectType.PROJECT,
        starredObjectValue: project.id,
        sourceObjectType: ObjectType.ORGANIZATION,
        sourceObjectValue: organization.id
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const removeStarHandler = (project) => {
    removeStarredObject({
      variables: {
        starredObjectType: ObjectType.PROJECT,
        starredObjectValue: project.id,
        sourceObjectType: ObjectType.ORGANIZATION,
        sourceObjectValue: organization.id
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const pinnedProjects = projects
    .filter(project => stars.indexOf(`${project.id}`) >= 0)
    .slice(0, 3)

  const otherProjects = projects
    .filter(project =>
      pinnedProjects
        .map(pinnedProject => pinnedProject.id)
        .indexOf(project.id) < 0
    )

  const displayModeBody = projects.length
    ? <div className='flex flex-col gap-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        {pinnedProjects
          .map((project, index) =>
            <div key={`project-${index}`}>
              <ProjectCard
                project={project}
                displayType={DisplayType.PINNED_CARD}
                starred={stars.indexOf(`${project.id}`) >= 0}
                addStarHandler={() => addStarHandler(project)}
                removeStarHandler={() => removeStarHandler(project)}
              />
            </div>
          )
        }
      </div>
      <div className='flex flex-col gap-y-4'>
        {otherProjects
          .map((project, index) =>
            <div key={`project-${index}`}>
              <ProjectCard
                project={project}
                displayType={DisplayType.SMALL_CARD}
                starred={stars.indexOf(`${project.id}`) >= 0}
                addStarHandler={() => addStarHandler(project)}
                removeStarHandler={() => removeStarHandler(project)}
              />
            </div>
          )
        }
      </div>
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.project.label'),
        base: format('ui.organization.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
      {format('ui.project.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.project.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, PROJECT_SEARCH_QUERY, fetchedProjectsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.project.label') })}
          onChange={addProject}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {projects.map((project, projectIdx) => (
          <Pill
            key={`projects-${projectIdx}`}
            label={project.name}
            onRemove={() => removeProject(project)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      editingAllowed={editingAllowed}
      sectionHeader={sectionHeader}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loadingMutation}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default StorefrontDetailProjects
