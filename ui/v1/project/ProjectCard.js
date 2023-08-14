import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const ProjectCard = ({ displayType, index, project }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-spearmint'}`}>
      <div className='flex flex-row gap-x-6'>
        <div className='flex flex-col gap-y-3 max-w-3xl'>
          <div className='text-lg font-semibold text-dial-meadow'>
            {project.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {project?.projectDescription && parse(project?.projectDescription.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.organization.header')} ({project.organizations?.length ?? 0})
            </div>
            <div className='border-r border-dial-stratos-400' />
            <div className='text-sm'>
              {format('ui.product.header')} ({project.products?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-stratos my-auto'>
          {project.name}
        </div>
      </div>
    </div>

  return (
    <Link href={`${REBRAND_BASE_PATH}/projects/${project.slug}`}>
      {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
    </Link>
  )
}

export default ProjectCard
