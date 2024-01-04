import { useCallback } from 'react'
import { FormattedDate, FormattedTime, useIntl } from 'react-intl'
import Link from 'next/link'
import { FaXmark, FaArrowRightLong } from 'react-icons/fa6'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const SyncCard = ({ displayType, index, sync, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[7rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-16 h-16 mx-auto bg-dial-plum rounded-full'>
          <img
            src='/ui/v1/sync-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.sync.label') })}
            className='object-contain w-8 h-8 mx-auto mt-4 white-filter'
          />
        </div>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {sync.name}
          </div>
          <div className='flex gap-x-2 text-sm text-dial-stratos'>
            {sync.tenantSource}
            <FaArrowRightLong className='my-auto' />
            {sync.tenantDestination}
          </div>
          <div className='flex flex-col gap-1'>
            {sync.lastSyncAt &&
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.sync.lastSyncAt')}:</span>
                <FormattedDate value={sync.lastSyncAt} />
                &nbsp;
                <FormattedTime value={sync.lastSyncAt} />
              </div>
            }
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-24'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <img
          src='/ui/v1/sync-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.sync.header') })}
          className='object-contain w-10 h-10 my-auto'
        />
        <div className='flex flex-col gap-y-2 py-3 text-dial-stratos'>
          <div className='text-sm font-semibold text-dial-iris-blue'>
            {sync.name}
          </div>
          <div className='flex gap-x-2 text-xs'>
            {sync.tenantSource} <FaArrowRightLong /> {sync.tenantDestination}
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/syncs/${sync.slug}`}>
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

export default SyncCard
