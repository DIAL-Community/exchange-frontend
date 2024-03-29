import { useIntl } from 'react-intl'
import { useCallback, useMemo, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { BsDash, BsPlus } from 'react-icons/bs'
import Select from '../form/Select'
import { generateLicenseTypeOptions } from '../form/options'

export const LicenseTypeAutocomplete = ({ licenseTypes, setLicenseTypes, placeholder }) => {
  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.licenseType.label') })

  const selectLicenseType = (licenseType) => {
    setLicenseTypes([...licenseTypes.filter(({ value }) => value !== licenseType.value), licenseType])
  }

  const options = useMemo(() => generateLicenseTypeOptions(format), [format])

  const loadOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.licenseType.label')}
        </div>
        {showFilter
          ? <BsDash className='ml-auto text-dial-stratos my-auto' />
          : <BsPlus className='ml-auto text-dial-stratos my-auto' />
        }
      </a>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.licenseType.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.licenseType.label') })}
          onChange={selectLicenseType}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const LicenseTypeActiveFilters = ({ licenseTypes, setLicenseTypes }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeLicenseType = (licenseTypeSlug) => {
    setLicenseTypes(licenseTypes => [...licenseTypes.filter(licenseType => licenseType.slug !== licenseTypeSlug)])
  }

  return (
    <>
      {licenseTypes?.map((licenseType, licenseTypeIndex) => (
        <div key={licenseTypeIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {licenseType.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.licenseType.label')})
              </div>
            </div>
            <button onClick={() => removeLicenseType(licenseType.slug)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
