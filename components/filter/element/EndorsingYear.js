import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '14rem'
  })
}

export const EndorsingYearSelect = (props) => {
  const [year, setYear] = useState('')
  const { years, setYears, containerStyles } = props

  const selectYear = (year) => {
    setYear('')
    setYears([...years.filter(p => p.value !== year.value), year])
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
    return options.filter(o => o.label.indexOf(input) >= 0)
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>Endorsing Year</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions={options}
          loadOptions={fetchOptions}
          onChange={selectYear}
          placeholder='Filter by Endorsing Year'
          styles={customStyles}
          value={year}
        />
      </label>
    </div>
  )
}

export const EndorsingYearFilters = (props) => {
  const { years, setYears } = props
  const removeYear = (yearId) => {
    setYears(years.filter(year => year.value !== yearId))
  }

  return (
    <>
      {
        years &&
          years.map(year => (
            <div key={`filter-${year.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`Endorsing Year: ${year.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeYear(year.value)} />
            </div>
          ))
      }
    </>
  )
}
