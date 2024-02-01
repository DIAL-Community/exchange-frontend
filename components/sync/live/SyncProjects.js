import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { PROJECT_SEARCH_QUERY } from '../../shared/query/project'
import { fetchSelectOptions } from '../../utils/search'

const SyncProjects = ({ projects, setProjects }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const fetchProjectsCallback = (data) => (
    data.projects?.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      label: project.name
    }))
  )

  const removeProject = (project) => {
    setProjects([...projects.filter(({ id }) => id !== project.id)])
  }

  const addProject = (project) => {
    setProjects([
      ...[
        ...projects.filter(({ id }) => id !== project.id),
        { id: project.id, name: project.name, slug: project.slug }
      ]
    ])
  }

  return (

    <div className='flex flex-col'>
      <ul className="flex flex-wrap gap-x-4 -mb-px">
        <li className="me-2">
          <div href='#' className='inline-block py-3 border-b-2 border-dial-sunshine'>
            {format('ui.project.header')}
          </div>
        </li>
      </ul>
      <div className='flex flex-col gap-y-3 border px-6 py-4'>
        <label className='flex flex-col gap-y-2'>
          {`${format('ui.syncTenant.searchFor')} ${format('ui.project.label')}`}
          <Select
            async
            isSearch
            isBorderless
            defaultOptions
            cacheOptions
            placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
            loadOptions={(input) =>
              fetchSelectOptions(client, input, PROJECT_SEARCH_QUERY, fetchProjectsCallback)
            }
            noOptionsMessage={() => format('ui.syncTenant.searchFor', { entity: format('ui.project.label') })}
            onChange={addProject}
            value={null}
          />
        </label>
        <div className='flex flex-wrap gap-3'>
          {projects.map((project, projectIdx) => (
            <Pill
              key={`author-${projectIdx}`}
              label={project.name}
              onRemove={() => removeProject(project)}
            />
          ))}
        </div>
      </div>
    </div>
  )

}

export default SyncProjects
