import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const RubricCategoryCard = ({ displayType, index, rubricCategory, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[8rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
        <div className='text-lg font-semibold text-dial-plum'>
          {rubricCategory.name}
        </div>
        <div className='line-clamp-4 text-dial-stratos'>
          {rubricCategory?.rubricCategoryDescription && parse(rubricCategory?.rubricCategoryDescription.description)}
        </div>
        <div className='flex gap-x-2 text-dial-stratos'>
          <div className='text-sm'>
            {format('categoryIndicator.header')} ({rubricCategory.categoryIndicators?.length ?? 0})
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {rubricCategory.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/rubric-categories/${rubricCategory.slug}`}>
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

export default RubricCategoryCard
