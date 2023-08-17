import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { BsPlus } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { useCallback, useState } from 'react'
import { fetchSelectOptions } from '../../utils/search'
import { COUNTRY_SEARCH_QUERY } from '../../shared/query/country'
import Select from '../form/Select'

export const CountryAutocomplete = ({
  countries,
  setCountries,
  placeholder = null,
  isSearch = false
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

  return (
    <div className='flex flex-col gap-y-3'>
      <button className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm ml-4 py-2'>
          {format('ui.country.label')}
        </div>
        <BsPlus className='ml-auto my-auto' />
      </button>
      {showFilter &&
        <Select
          async
          aria-label={format('filter.byEntity', { entity: format('ui.country.label') })}
          className='ml-4 rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, COUNTRY_SEARCH_QUERY, fetchedCountriesCallback)}
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

export const CountryActiveFilters = (props) => {
  const { countries, setCountries } = props

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
              <IoClose size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
