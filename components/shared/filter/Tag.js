import { useCallback, useState } from 'react'
import { BsDash, BsPlus } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'
import { fetchSelectOptions } from '../../utils/search'
import Select from '../form/Select'
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
      name: tag.name,
      slug: tag.slug,
      label: tag.name,
      value: tag.id
    }))
  )

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.tag.label')}
        </div>
        {showFilter
          ? <BsDash className='ml-auto text-dial-stratos my-auto' />
          : <BsPlus className='ml-auto text-dial-stratos my-auto' />
        }
      </a>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.tag.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
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
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
