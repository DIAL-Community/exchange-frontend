import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const COUNTRY_SEARCH_QUERY = gql`
  query SearchCountries($search: String!) {
    searchCountries(search: $search) {
      name
      slug
    }
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '10rem'
  })
}

export const CountryAutocomplete = (props) => {
  const client = useApolloClient()
  const [country, setCountry] = useState('')
  const { countries, setCountries, containerStyles } = props

  const selectCountry = (country) => {
    setCountry('')
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

    if (response.data && response.data.searchCountries) {
      return response.data.searchCountries.map((country) => ({
        label: country.name,
        value: country.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>Countries</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions={false}
          loadOptions={(input, callback) => fetchOptions(input, callback, COUNTRY_SEARCH_QUERY)}
          noOptionsMessage={() => 'Search for countries.'}
          onChange={selectCountry}
          placeholder='Filter by Country'
          styles={customStyles}
          value={country}
        />
      </label>
    </div>
  )
}

export const CountryFilters = (props) => {
  const { countries, setCountries } = props
  const removeCountry = (countryId) => {
    setCountries(countries.filter(country => country.value !== countryId))
  }

  return (
    <>
      {
        countries &&
          countries.map(country => (
            <div key={`filter-${country.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`Country: ${country.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeCountry(country.value)} />
            </div>
          ))
      }
    </>
  )
}
