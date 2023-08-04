import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { IoClose } from 'react-icons/io5'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const SectorCard = ({ displayType, index, sector, dismissCardHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {sector.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {sector?.sectorDescription && parse(sector?.sectorDescription.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sector.header')} ({sector.sectors?.length ?? 0})
            </div>
            <div className='border border-r text-dial-stratos-300' />
            <div className='text-sm'>
              {format('ui.country.header')} ({sector.countries?.length ?? 0})
            </div>
            <div className='border border-r text-dial-stratos-300' />
            <div className='text-sm'>
              {format('ui.project.header')} ({sector.projects?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-sector-bg-light to-sector-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {sector.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`${REBRAND_BASE_PATH}/sectors/${sector.slug}`}>
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

export default SectorCard
