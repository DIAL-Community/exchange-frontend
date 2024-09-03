import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FaXmark } from 'react-icons/fa6'
import { DisplayType } from '../../utils/constants'
import { isValidFn } from '../../utils/utilities'

const CountryCard = ({ displayType, index, country, dismissHandler }) => {
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
        <div className='text-sm font-semibold text-dial-plum my-auto line-clamp-1'>
          {country.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default CountryCard
