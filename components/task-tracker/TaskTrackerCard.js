import Link from 'next/link'
import parse from 'html-react-parser'
import { useCallback } from 'react'
import { FormattedDate, FormattedTime, useIntl } from 'react-intl'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const TaskTrackerCard = ({ displayType, index, taskTracker, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {taskTracker.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {taskTracker?.taskTrackerDescription && parse(taskTracker?.taskTrackerDescription.description)}
          </div>
          <div className='flex flex-col gap-1'>
            <div className='line-clamp-1 text-xs italic'>
              {`${taskTracker.taskCompleted}` === 'true' &&
                <div className='font-semibold text-green-700'>
                  {format('ui.taskTracker.complete')}
                </div>
              }
              {`${taskTracker.taskCompleted}` === 'false' &&
                <div className='font-semibold text-red-700'>
                  {format('ui.taskTracker.incomplete')}
                </div>
              }
            </div>
            <div className='text-xs italic'>
              <span className='pr-[2px]'>{format('ui.taskTracker.lastStartedDate')}:</span>
              <FormattedDate value={taskTracker.lastStartedDate} />
              &nbsp;
              <FormattedTime value={taskTracker.lastStartedDate} />
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-taskTracker-bg-light to-taskTracker-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {taskTracker.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/task-trackers/${taskTracker.slug}`}>
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

export default TaskTrackerCard
