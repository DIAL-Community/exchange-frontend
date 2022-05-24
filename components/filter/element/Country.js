import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'
import { COUNTRY_SEARCH_QUERY } from '../../../queries/country'
import { fetchSelectOptions } from '../../../queries/utils'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const customStyles = (controlSize = '12rem') => {
  return {
    ...asyncSelectStyles,
    control: (provided) => ({
      ...provided,
      width: controlSize,
      boxShadow: 'none',
      cursor: 'pointer'
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer'
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 30 }),
    menu: (provided) => ({ ...provided, zIndex: 30 })
  }
}

export const CountryAutocomplete = (props) => {
  const client = useApolloClient()
  const { countries, setCountries, containerStyles, controlSize } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectCountry = (country) => {
    setCountries([...countries.filter(c => c.value !== country.value), country])
  }

  const fetchedCountriesCallback = (data) => (
    data.countries.map((country) => ({
      label: country.name,
      value: country.id,
      slug: country.slug
    }))
  )

  return (
    <div className={`${containerStyles} catalog-filter text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', { entity: format('country.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, COUNTRY_SEARCH_QUERY, fetchedCountriesCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('country.header') })}
        onChange={selectCountry}
        placeholder={format('filter.byEntity', { entity: format('country.label') })}
        styles={customStyles(controlSize)}
        value=''
      />
    </div>
  )
}

export const CountryFilters = (props) => {
  const { countries, setCountries } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeCountry = (countryId) => {
    setCountries(countries.filter(country => country.value !== countryId))
  }

  return (
    <>
      {
        countries &&
          countries.map(country => (
            <div key={`filter-${country.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('country.label')}: ${country.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeCountry(country.value)} />
            </div>
          ))
      }
    </>
  )
}
