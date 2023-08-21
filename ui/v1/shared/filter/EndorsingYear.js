import { useIntl } from 'react-intl'
import { BsPlus } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { useCallback, useState } from 'react'
import Select from '../form/Select'

export const EndorsingYearSelect = ({
  years,
  setYears,
  placeholder = null,
  isSearch = false
}) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [showFilter, setShowFilter] = useState(false)

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.endorsingYear.label') })

  const selectYear = (year) => {
    setYears([...years.filter(({ value }) => value !== year.value), year])
  }

  const options = (() => {
    let startYear = 2015
    const currentYear = new Date().getFullYear()

    const years = []
    while (startYear <= currentYear) {
      years.push({ value: startYear, label: startYear })
      startYear = startYear + 1
    }

    return years
  })()

  const fetchOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <button type='button' className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.endorsingYear.label')}
        </div>
        <BsPlus className='ml-auto my-auto' />
      </button>
      {showFilter &&
        <Select
          async
          aria-label={format('filter.byEntity', { entity: format('ui.endorsingYear.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions={options}
          loadOptions={fetchOptions}
          onChange={selectYear}
          placeholder={controlPlaceholder}
          value=''
          isSearch={isSearch}
        />
      }
    </div>
  )
}

export const EndorsingYearActiveFilters = ({ years, setYears }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeYear = (yearValue) => {
    setYears(years.filter(({ value }) => value !== yearValue))
  }

  return (
    <>
      {years?.map((year, yearIndex) => (
        <div key={yearIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {year.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.endorsingYear.label')})
              </div>
            </div>
            <button onClick={() => removeYear(year.value)}>
              <IoClose size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
