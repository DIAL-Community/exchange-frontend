import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_ORGANIZATION_PROJECTS } from '../../mutations/organization'
import { fetchSelectOptions } from '../../queries/utils'
import ProjectCard from '../projects/ProjectCard'
import { PROJECT_SEARCH_QUERY } from '../../queries/project'

const OrganizationDetailProjects = ({ organization, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [projects, setProjects] = useState(organization.projects)

  const [isDirty, setIsDirty] = useState(false)

  const [updateOrganizationProjects, { data, loading }] = useMutation(UPDATE_ORGANIZATION_PROJECTS)

  const { data: session } = useSession()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (data?.updateOrganizationProjects?.errors.length === 0 && data?.updateOrganizationProjects?.organization) {
      setProjects(data.updateOrganizationProjects.organization.projects)
      setIsDirty(false)
      showToast(format('organization.projects.updated'), 'success', 'top-center')
    }
  }, [data, showToast, format])

  const fetchedProjectsCallback = (data) => (
    data.projects.map((project) => ({
      label: project.name,
      value: project.id,
      slug: project.slug,
      origin: project.origin
    }))
  )

  const addProject = (project) => {
    setProjects([
      ...projects.filter(({ slug }) => slug !== project.slug),
      { name: project.label, slug: project.slug, origin: project.origin }
    ])
    setIsDirty(true)
  }

  const removeProject = (project) => {
    setProjects([...projects.filter(({ slug }) => slug !== project.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (session) {
      const { userEmail, userToken } = session.user

      updateOrganizationProjects({
        variables: {
          slug: organization.slug,
          projectsSlugs: projects.map(({ slug }) => slug)
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
    setProjects(data?.updateOrganizationProjects?.organization?.projects ?? organization.projects)
    setIsDirty(false)
  }

  const displayModeBody = projects.length > 0
    ? (
      <div className='flex flex-col gap-2'>
        {projects.map((project, projectIdx) => <ProjectCard key={projectIdx} project={project} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('organization.no-project')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('project.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='project-search'>
        {`${format('app.searchAndAssign')} ${format('project.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, PROJECT_SEARCH_QUERY, fetchedProjectsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('project.header') })}
          onChange={addProject}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {projects.map((project, projectIdx) => (
          <Pill
            key={`project-${projectIdx}`}
            label={project.name}
            onRemove={() => removeProject(project)}
          />
        ))}
      </div>
    </>

  return (
    (organization.projects.length > 0 || canEdit) && (
      <EditableSection
        canEdit={canEdit}
        sectionHeader={format('project.header')}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isDirty={isDirty}
        isMutating={loading}
        displayModeBody={displayModeBody}
        editModeBody={editModeBody}
      />
    )
  )
}

export default OrganizationDetailProjects
