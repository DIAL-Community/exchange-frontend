import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import { IoClose } from 'react-icons/io5'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const CityCard = ({ displayType, index, city, dismissCardHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src='/ui/v1/user-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.city.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {city.name}
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='w-10 h-10 my-auto'>
          <img
            src='/ui/v1/map-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.city.header') })}
            className='object-contain w-8 h-8 my-auto'
          />
        </div>
        <div className='text-sm font-semibold text-dial-stratos my-auto'>
          {city.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`${REBRAND_BASE_PATH}/cities/${city.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      {dismissCardHandler && {}.toString.call(dismissCardHandler) === '[object Function]' &&
        <button className='absolute p-2 top-0 right-0 text-dial-sapphire'>
          <IoClose size='1rem' onClick={dismissCardHandler} />
        </button>
      }
    </div>
  )
}

export default CityCard
