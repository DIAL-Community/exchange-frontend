import { useCallback } from 'react'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const TenantSettingCard = ({ displayType, index, tenantSetting, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[8rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {tenantSetting.tenantName}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.tenantSetting.tenantDomains.header')} ({tenantSetting.tenantDomains?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-tenantSetting-bg-light to-tenantSetting-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {tenantSetting.tenantName}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/admin/tenant-settings/${tenantSetting.tenantName}`}>
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

export default TenantSettingCard
