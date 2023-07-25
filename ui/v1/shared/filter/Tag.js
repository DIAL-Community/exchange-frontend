import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { BsPlus } from 'react-icons/bs'
import { useApolloClient } from '@apollo/client'
import Select from '../form/Select'
import { fetchSelectOptions } from '../../utils/search'
import { TAG_SEARCH_QUERY } from '../query/tag'

export const TagAutocomplete = ({ tags, setTags, placeholder }) => {
  const client = useApolloClient()

  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.tag.label') })

  const selectTag = (tag) => {
    setTags([...tags.filter(s => s.value !== tag.value), tag])
  }

  const fetchCallback = (data) => (
    data?.tags.map((tag) => ({
      label: tag.name,
      value: tag.id,
      slug: tag.slug
    }))
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <button className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm ml-4'>
          {format('ui.tag.label')}
        </div>
        <BsPlus className='ml-auto' />
      </button>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.tag.label') })}
          className='ml-4 rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, TAG_SEARCH_QUERY, fetchCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.tag.label') })}
          onChange={selectTag}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const TagActiveFilters = ({ tags, setTags }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeTag = (tagSlug) => {
    setTags(tags => [...tags.filter(tag => tag.slug !== tagSlug)])
  }

  return (
    <>
      {tags?.map((tag, tagIndex) => (
        <div key={tagIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {tag.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.tag.label')})
              </div>
            </div>
            <button onClick={() => removeTag(tag.slug)}>
              <IoClose size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
