import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import classNames from 'classnames'
import { COUNTRY_SEARCH_QUERY } from '../../../queries/country'
import { fetchSelectOptions } from '../../../queries/utils'
import Select from '../../shared/Select'
import Pill from '../../shared/Pill'

export const CountryAutocomplete = ({
  countries,
  setCountries,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('country.label') })

  const selectCountry = (country) => {
    setCountries([...countries.filter(({ slug }) => slug !== country.slug), country])
  }

  const fetchedCountriesCallback = (data) => (
    data.countries.map((country) => ({
      label: country.name,
      value: country.id,
      slug: country.slug
    }))
  )

  return (
    <div className={classNames(containerStyles)} data-testid='country-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('country.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, COUNTRY_SEARCH_QUERY, fetchedCountriesCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('country.header') })}
        onChange={selectCountry}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const CountryFilters = (props) => {
  const { countries, setCountries } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeCountry = (countrySlug) => {
    setCountries(countries.filter(({ slug }) => slug !== countrySlug))
  }

  return (
    <>
      {countries?.map((country, countryIdx) => (
        <div className='py-1' key={countryIdx}>
          <Pill
            key={`filter-${countryIdx}`}
            label={`${format('country.label')}: ${country.label}`}
            onRemove={() => removeCountry(country.slug)}
          />
        </div>
      ))}
    </>
  )
}
