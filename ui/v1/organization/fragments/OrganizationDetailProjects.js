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

const OrganizationDetailProjects = ({ organization, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [projects, setProjects] = useState(organization.projects)
  const [isDirty, setIsDirty] = useState(false)

  const [updateOrganizationProjects, { loading, reset }] = useMutation(UPDATE_ORGANIZATION_PROJECTS, {
    onError() {
      setIsDirty(false)
      setProjects(organization?.projects)
      showToast(format('toast.projects.update.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { updateOrganizationProjects: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setIsDirty(false)
        setProjects(response?.organization?.projects)
        showToast(format('toast.projects.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setProjects(organization?.projects)
        showToast(format('toast.projects.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedProjectsCallback = (data) => (
    data.projects?.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      label: project.name
    }))
  )

  const addProjects = (project) => {
    setProjects([
      ...[
        ...projects.filter(({ id }) => id !== project.id),
        { id: project.id, name: project.name, slug: project.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeProjects = (project) => {
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
          onChange={addProjects}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {projects.map((project, projectIdx) => (
          <Pill
            key={`projects-${projectIdx}`}
            label={project.name}
            onRemove={() => removeProjects(project)}
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

export default OrganizationDetailProjects
