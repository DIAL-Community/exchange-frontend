import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const SDG_SEARCH_QUERY = gql`
  query SearchSDGs($search: String!) {
    searchSdgs(search: $search) {
      name
      slug
    }
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '11rem'
  })
}

export const SDGAutocomplete = (props) => {
  const client = useApolloClient()
  const [sdg, setSDG] = useState('')
  const { sdgs, setSDGs, containerStyles } = props

  const selectSDG = (sdg) => {
    setSDG('')
    setSDGs([...sdgs.filter(s => s.value !== sdg.value), sdg])
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

    if (response.data && response.data.searchSdgs) {
      return response.data.searchSdgs.map((sdg) => ({
        label: sdg.name,
        value: sdg.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>SDGs</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, SDG_SEARCH_QUERY)}
          noOptionsMessage={() => 'Search for sdgs.'}
          onChange={selectSDG}
          placeholder='Filter by SDG'
          styles={customStyles}
          value={sdg}
        />
      </label>
    </div>
  )
}

export const SDGFilters = (props) => {
  const { sdgs, setSDGs } = props
  const removeSDG = (sdgId) => {
    setSDGs(sdgs.filter(sdg => sdg.value !== sdgId))
  }

  return (
    <>
      {
        sdgs &&
          sdgs.map(sdg => (
            <div key={`filter-${sdg.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`SDG: ${sdg.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeSDG(sdg.value)} />
            </div>
          ))
      }
    </>
  )
}
