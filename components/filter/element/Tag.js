import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const TAG_SEARCH_QUERY = gql`
  query Tags($search: String!) {
    tags(search: $search) {
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
  })
}

export const TagAutocomplete = (props) => {
  const client = useApolloClient()
  const { tags, setTags, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectTag = (tag) => {
    setTags([...tags.filter(s => s.value !== tag.value), tag])
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

    if (response.data && response.data.tags) {
      return response.data.tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
        slug: tag.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <div className='flex flex-row'>
          <div className='text-sm px-2 text-dial-gray-light my-auto'>
            {format('tag.header')}
          </div>
        </div>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, TAG_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('tag.header') })}
          onChange={selectTag}
          placeholder={format('filter.byEntity', { entity: format('tag.label') })}
          styles={customStyles}
          value=''
        />
      </label>
    </div>
  )
}

export const TagFilters = (props) => {
  const { tags, setTags } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeTag = (tagId) => {
    setTags(tags.filter(tag => tag.value !== tagId))
  }

  return (
    <>
      {
        tags &&
          tags.map(tag => (
            <div key={`filter-${tag.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('tag.label')}: ${tag.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeTag(tag.value)} />
            </div>
          ))
      }
    </>
  )
}
