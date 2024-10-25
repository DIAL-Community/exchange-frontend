import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { EDITING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { PROJECT_POLICY_QUERY } from '../../shared/query/project'
import { prependUrlWithProtocol } from '../../utils/utilities'
import ProjectDetailSectors from './ProjectDetailSectors'

const ProjectDetailHeader = ({ project }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  let editingAllowed = false
  const { error } = useQuery(PROJECT_POLICY_QUERY, {
    variables: { slug: EDITING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (!error) {
    editingAllowed = true
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {project.name}
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        { project.projectWebsite &&
          <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-dial-plum'>
              {format('project.url')}
            </div>
            <div className='flex text-dial-stratos'>
              <a
                href={prependUrlWithProtocol(project.projectWebsite)}
                target='_blank'
                rel='noreferrer'
                className='flex border-b border-dial-iris-blue '>
                <div className='line-clamp-1 break-all'>
                  {project.projectWebsite}
                </div>
              </a>
              &nbsp;⧉
            </div>
          </div>
        }
        <ProjectDetailSectors project={project} editingAllowed={editingAllowed} />
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-plum'>
            {format('ui.origin.label')}
          </div>
          <div className='flex flex-col gap-y-2 text-dial-stratos'>
            {project?.origin.name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailHeader
