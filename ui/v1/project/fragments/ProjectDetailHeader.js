import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../utils/utilities'

const ProjectDetailHeader = ({ project }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-meadow font-semibold'>
        {project.name}
      </div>
      <div className='flex flex-col gap-y-8 text-sm pt-6 pb-3'>
        { project.projectWebsite &&
          <div className='flex flex-col gap-y-3'>
            <div className='font-semibold text-dial-sapphire'>
              {format('project.url')}
            </div>
            <div className='flex gap-x-2 text-dial-stratos'>
              <a
                href={prependUrlWithProtocol(project.projectWebsite)}
                target='_blank'
                rel='noreferrer'
                className='flex border-b border-dial-iris-blue '>
                <div className='line-clamp-1'>
                  {project.projectWebsite}
                </div>
              </a>
              ⧉
            </div>
          </div>
        }
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
            {format('ui.sector.header')}
          </div>
          <div className='flex flex-col gap-y-2 text-dial-stratos'>
            {project.sectors.length === 0 && format('general.na')}
            {project.sectors.map((sector, index) => {
              return <div key={index}>{sector.name}</div>
            })}
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-sapphire'>
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
