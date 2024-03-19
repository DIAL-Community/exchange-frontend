import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { BsDash, BsPlus } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import { useCallback, useState } from 'react'
import { fetchSelectOptions } from '../../utils/search'
import { COUNTRY_SEARCH_QUERY } from '../query/country'
import Select from '../form/Select'

export const CountryAutocomplete = ({
  countries,
  setCountries,
  searchQuery = COUNTRY_SEARCH_QUERY,
  placeholder = null,
  isSearch = false,
  inline = false
}) => {
  const client = useApolloClient()
  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.country.label') })

  const selectCountry = (country) => {
    setCountries([...countries.filter(({ slug }) => slug !== country.slug), country])
  }

  const fetchedCountriesCallback = (data) => (
    data.countries.map((country) => ({
      value: country.id,
      label: country.name,
      slug: country.slug
    }))
  )

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return inline ? (
    <div className='flex flex-col gap-y-3'>
      <Select
        async
        isBorderless
        aria-label={format('filter.byEntity', { entity: format('ui.country.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, searchQuery, fetchedCountriesCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.country.header') })}
        onChange={selectCountry}
        placeholder={controlPlaceholder}
        value=''
        isSearch={isSearch}
      />
    </div>
  ) : (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.country.label')}
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
          aria-label={format('filter.byEntity', { entity: format('ui.country.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, searchQuery, fetchedCountriesCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.country.header') })}
          onChange={selectCountry}
          placeholder={controlPlaceholder}
          value=''
          isSearch={isSearch}
        />
      }
    </div>
  )
}

export const CountryActiveFilters = ({ countries, setCountries }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeCountry = (countrySlug) => {
    setCountries(countries.filter(({ slug }) => slug !== countrySlug))
  }

  return (
    <>
      {countries?.map((country, countryIndex) => (
        <div key={countryIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {country.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.country.label')})
              </div>
            </div>
            <button onClick={() => removeCountry(country.slug)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
