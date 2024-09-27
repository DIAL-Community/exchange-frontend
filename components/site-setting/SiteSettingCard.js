import { useCallback } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const SiteSettingCard = ({ displayType, index, siteSetting, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[8rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {siteSetting.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {siteSetting?.description && parse(siteSetting?.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.siteSetting.menu.header')} ({siteSetting.menuConfigurations?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.siteSetting.carousel.header')} ({siteSetting.carouselConfigurations?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.siteSetting.heroCard.header')} ({siteSetting.heroCardConfigurations?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-siteSetting-bg-light to-siteSetting-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {siteSetting.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/admin/site-settings/${siteSetting.slug}`}>
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

export default SiteSettingCard
