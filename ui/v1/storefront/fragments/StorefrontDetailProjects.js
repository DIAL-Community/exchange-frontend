import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import Select from '../../shared/form/Select'
import { PROJECT_SEARCH_QUERY } from '../../../../queries/project'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import { fetchSelectOptions } from '../../utils/search'
import { DisplayType } from '../../utils/constants'
import { UPDATE_ORGANIZATION_PROJECTS } from '../../shared/mutation/organization'
import ProjectCard from '../../project/ProjectCard'

const StorefrontDetailProjects = ({ organization, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [projects, setProjects] = useState(organization.projects)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOrganizationProjects, { loading, reset }] = useMutation(UPDATE_ORGANIZATION_PROJECTS, {
    onError() {
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
  })

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
    if (user) {
      const { userEmail, userToken } = user

      updateOrganizationProjects({
        variables: {
          projectSlugs: projects.map(({ slug }) => slug),
          slug: organization.slug
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

  const onCancel = () => {
    setProjects(organization.projects)
    setIsDirty(false)
  }

  const displayModeBody = projects.length
    ? <div className='flex flex-col gap-y-4'>
      {projects?.map((project, index) =>
        <div key={`project-${index}`}>
          <ProjectCard project={project} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.project.label'),
        base: format('ui.storefront.label')
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
      canEdit={canEdit}
      sectionHeader={sectionHeader}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default StorefrontDetailProjects
