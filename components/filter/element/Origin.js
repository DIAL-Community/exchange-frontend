import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const ORIGIN_SEARCH_QUERY = gql`
  query Origins($search: String!) {
    origins(search: $search) {
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
    cursor: 'pointer'
  }),
  menuPortal: (provided) => ({ ...provided, zIndex: 30 }),
  menu: (provided) => ({ ...provided, zIndex: 30 })
}

export const OriginAutocomplete = (props) => {
  const client = useApolloClient()
  const { origins, setOrigins, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectOrigin = (origin) => {
    setOrigins([...origins.filter(o => o.value !== origin.value), origin])
  }

  const fetchOptions = async (input, callback, query) => {
    if (input && input.trim().length < 4) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input
      }
    })

    if (response.data && response.data.origins) {
      return response.data.origins.map((origin) => ({
        label: origin.name,
        value: origin.id,
        slug: origin.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>{format('origin.header')}</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, ORIGIN_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('origin.header') })}
          onChange={selectOrigin}
          placeholder={format('filter.byEntity', { entity: format('origin.label') })}
          styles={customStyles}
          value=''
        />
      </label>
    </div>
  )
}

export const OriginFilters = (props) => {
  const { origins, setOrigins } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeOrigin = (originId) => {
    setOrigins(origins.filter(origin => origin.value !== originId))
  }

  return (
    <>
      {
        origins &&
          origins.map(origin => (
            <div key={`filter-${origin.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('origin.label')}: ${origin.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeOrigin(origin.value)} />
            </div>
          ))
      }
    </>
  )
}
