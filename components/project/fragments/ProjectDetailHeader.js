import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../utils/utilities'
import ProjectDetailSectors from './ProjectDetailSectors'

const ProjectDetailHeader = ({ project, editingAllowed }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
