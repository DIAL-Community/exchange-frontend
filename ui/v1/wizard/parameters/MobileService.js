import { useIntl } from 'react-intl'
import { useCallback, useMemo, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { BsDash, BsPlus } from 'react-icons/bs'
import Select from '../../shared/form/Select'
import { generateMobileServiceOptions } from '../../shared/form/options'

export const MobileServiceAutocomplete = ({ mobileServices, setMobileServices, placeholder }) => {
  const [showFilter, setShowFilter] = useState(true)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.mobileService.label') })

  const selectMobileService = (mobileService) => {
    setMobileServices([...mobileServices.filter(({ value }) => value !== mobileService.value), mobileService])
  }

  const options = useMemo(() => generateMobileServiceOptions(), [])

  const loadOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex bg-dial-slate-100 px-3' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-iris-blue font-semibold text-sm py-2'>
          {format('ui.mobileService.label')}
        </div>
        {showFilter
          ? <BsDash className='ml-auto text-dial-iris-blue my-auto' />
          : <BsPlus className='ml-auto text-dial-iris-blue my-auto' />
        }
      </a>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.mobileService.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.mobileService.label') })}
          onChange={selectMobileService}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const MobileServiceActiveFilters = ({ mobileServices, setMobileServices }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeMobileService = (mobileServiceSlug) => {
    setMobileServices(mobileServices => [
      ...mobileServices.filter(mobileService => mobileService.slug !== mobileServiceSlug)
    ])
  }

  return (
    <>
      {mobileServices?.map((mobileService, mobileServiceIndex) => (
        <div key={mobileServiceIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {mobileService.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.mobileService.label')})
              </div>
            </div>
            <button className='ml-auto' onClick={() => removeMobileService(mobileService.slug)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
