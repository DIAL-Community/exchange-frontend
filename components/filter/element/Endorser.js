import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const ENDORSER_SEARCH_QUERY = gql`
  query Endorsers($search: String!) {
    endorsers(search: $search) {
      id
      name
      slug
    }
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '16rem',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  })
}

export const EndorserAutocomplete = (props) => {
  const client = useApolloClient()
  const { endorsers, setEndorsers, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectEndorser = (endorser) => {
    setEndorsers([...endorsers.filter(c => c.value !== endorser.value), endorser])
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

    if (response.data && response.data.endorsers) {
      return response.data.endorsers.map((endorser) => ({
        label: endorser.name,
        value: endorser.id,
        slug: endorser.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>{format('endorser.header')}</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, ENDORSER_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('endorser.header') })}
          onChange={selectEndorser}
          placeholder={format('filter.byEntity', { entity: format('endorser.label') })}
          styles={customStyles}
          value=''
        />
      </label>
    </div>
  )
}

export const EndorserFilters = (props) => {
  const { endorsers, setEndorsers } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeEndorser = (endorserId) => {
    setEndorsers(endorsers.filter(endorser => endorser.value !== endorserId))
  }

  return (
    <>
      {
        endorsers &&
          endorsers.map(endorser => (
            <div key={`filter-${endorser.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('endorser.label')}: ${endorser.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeEndorser(endorser.value)} />
            </div>
          ))
      }
    </>
  )
}
