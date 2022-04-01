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

const customStyles = (controlSize = '12rem') => {
  return {
    ...asyncSelectStyles,
    control: (provided) => ({
      ...provided,
      width: controlSize,
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

export const TagAutocomplete = (props) => {
  const client = useApolloClient()
  const { tags, setTags, containerStyles, controlSize, placeholder } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  let controlPlaceholder = placeholder
  if (!controlPlaceholder) {
    controlPlaceholder = format('filter.byEntity', { entity: format('tag.label') })
  }

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
        slug: tag.name
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', { entity: format('tag.label') })}
        className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
        cacheOptions
        defaultOptions
        loadOptions={(input, callback) => fetchOptions(input, callback, TAG_SEARCH_QUERY)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('tag.header') })}
        onChange={selectTag}
        placeholder={controlPlaceholder}
        styles={customStyles(controlSize)}
        value=''
      />
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
            <div key={`filter-${tag.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('tag.label')}: ${tag.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeTag(tag.value)} />
            </div>
          ))
      }
    </>
  )
}
