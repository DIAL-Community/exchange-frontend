import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import { IoClose } from 'react-icons/io5'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const CountryCard = ({ displayType, index, country, dismissCardHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg h-[10rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src={`https://flagsapi.com/${country.code.toUpperCase()}/flat/64.png`}
            alt={format('ui.country.logoAlt', { countryName: country.code })}
            className='object-contain w-16 h-16'
          />
        </div>
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {country.name}
          </div>
          <div className='flex flex-col gap-y-1'>
            <div className='text-sm text-dial-stratos'>
              {format('country.code')}: {country?.code}
            </div>
            <div className='text-sm text-dial-stratos'>
              {format('country.codeLonger')}: {country?.codeLonger}
            </div>
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.organization.header')} ({country.organizations?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.project.header')} ({country.projects?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        <img
          src={`https://flagsapi.com/${country.code.toUpperCase()}/flat/64.png`}
          alt={format('ui.country.logoAlt', { countryName: country.code })}
          className='object-contain w-10 h-10 my-auto'
        />
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {country.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`${REBRAND_BASE_PATH}/countries/${country.slug}`}>
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

export default CountryCard
