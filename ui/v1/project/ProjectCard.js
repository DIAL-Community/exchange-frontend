import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaXmark, FaRegStar, FaStar } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const ProjectCard = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    index,
    project,
    starred,
    displayType,
    dismissHandler,
    addStarHandler,
    removeStarHandler
  } = props

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
            <div className='border-r border-dial-slate-400' />
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
    <div className='relative'>
      <Link href={`/projects/${project.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      <div className='absolute p-2 top-2 right-2'>
        <div className='flex flex-row gap-2'>
          { isValidFn(dismissHandler) &&
            <button type='button'className='text-dial-plum' >
              <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
            </button>
          }
          { isValidFn(addStarHandler) && !starred &&
            <button type='button'className='text-dial-plum'>
              <FaRegStar size='1rem' className='text-dial-plum' onClick={addStarHandler} />
            </button>
          }
          { isValidFn(removeStarHandler) && starred &&
            <button type='button'className='text-dial-plum'>
              <FaStar size='1rem' className='text-dial-plum' onClick={removeStarHandler} />
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
