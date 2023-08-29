import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const TagCard = ({ displayType, index, tag, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {tag.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {tag?.tagDescription && parse(tag?.tagDescription.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.dataset.header')} ({tag.datasets?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.product.header')} ({tag.products?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.project.header')} ({tag.projects?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.useCase.header')} ({tag.useCases?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-tag-bg-light to-tag-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {tag.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/tags/${tag.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default TagCard
