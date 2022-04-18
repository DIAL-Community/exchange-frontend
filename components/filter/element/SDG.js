import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const SDG_SEARCH_QUERY = gql`
  query SDGs($search: String!) {
    sdgs(search: $search) {
      id
      name
      slug
      number
    }
  }
`

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

export const SDGAutocomplete = (props) => {
  const client = useApolloClient()
  const { sdgs, setSDGs, containerStyles, controlSize } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectSDG = (sdg) => {
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

    if (response.data && response.data.sdgs) {
      return response.data.sdgs.map((sdg) => ({
        label: `${sdg.number}. ${sdg.name}`,
        value: sdg.id,
        slug: sdg.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} catalog-filter text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', { entity: format('sdg.shortLabel') })}
        className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
        cacheOptions
        defaultOptions
        loadOptions={(input, callback) => fetchOptions(input, callback, SDG_SEARCH_QUERY)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('sdg.shortHeader') })}
        onChange={selectSDG}
        placeholder={format('filter.byEntity', { entity: format('sdg.shortLabel') })}
        styles={customStyles(controlSize)}
        value=''
      />
    </div>
  )
}

export const SDGFilters = (props) => {
  const { sdgs, setSDGs } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeSDG = (sdgId) => {
    setSDGs(sdgs.filter(sdg => sdg.value !== sdgId))
  }

  return (
    <>
      {
        sdgs &&
          sdgs.map(sdg => (
            <div key={`filter-${sdg.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('sdg.shortLabel')}: ${sdg.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeSDG(sdg.value)} />
            </div>
          ))
      }
    </>
  )
}
