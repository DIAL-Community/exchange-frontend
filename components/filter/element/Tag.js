import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import classNames from 'classnames'
import Select from '../../shared/Select'
import { TAG_SEARCH_QUERY } from '../../../queries/tag'
import { fetchSelectOptions } from '../../../queries/utils'
import Pill from '../../shared/Pill'

export const TagAutocomplete = ({
  tags,
  setTags,
  tagQuery,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('tag.label') })

  const selectTag = (tagToAdd) => setTags([...tags.filter(({ value }) => value !== tagToAdd.value), tagToAdd])

  const fetchedTagsCallback = (data) => {
    if (data) {
      const tags = data.tags ?? data.searchPlaybookTags

      return tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
        slug: tag.name
      }))
    }

    return []
  }

  return (
    <div className={classNames(containerStyles)}>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('tag.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, tagQuery || TAG_SEARCH_QUERY, fetchedTagsCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('tag.header') })}
        onChange={selectTag}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const TagFilters = (props) => {
  const { tags, setTags } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeTag = (tagId) => {
    setTags(tags.filter(tag => tag.value !== tagId))
  }

  return (
    <>
      {tags?.map((tag, tagIdx) => (
        <div key={tagIdx}>
          <Pill
            key={`filter-${tagIdx}`}
            label={`${format('tag.label')}: ${tag.label}`}
            onRemove={() => removeTag(tag.value)}
          />
        </div>
      ))}
    </>
  )
}
