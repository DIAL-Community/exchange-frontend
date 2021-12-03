import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const COUNTRY_SEARCH_QUERY = gql`
  query Countries($search: String!) {
    countries(search: $search) {
      id
      name
      slug
    }
  }
`

const customStyles = {
  ...asyncSelectStyles,
  control: (provided) => ({
    ...provided,
    width: '12rem',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer',
    zIndex: '100'
  }),
  menuPortal: (provided) => ({ ...provided, zIndex: 30 }),
  menu: (provided) => ({ ...provided, zIndex: 30 })
}

export const CountryAutocomplete = (props) => {
  const client = useApolloClient()
  const { countries, setCountries, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectCountry = (country) => {
    setCountries([...countries.filter(c => c.value !== country.value), country])
  }

  const fetchOptions = async (input, callback, query) => {
    if (input && input.trim().length < 2) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input
      }
    })

    if (response.data && response.data.countries) {
      return response.data.countries.map((country) => ({
        label: country.name,
        value: country.id,
        slug: country.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>{format('country.header')}</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, COUNTRY_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('country.header') })}
          onChange={selectCountry}
          placeholder={format('filter.byEntity', { entity: format('country.label') })}
          styles={customStyles}
          value=''
        />
      </label>
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
            <div key={`filter-${country.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('country.label')}: ${country.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeCountry(country.value)} />
            </div>
          ))
      }
    </>
  )
}
