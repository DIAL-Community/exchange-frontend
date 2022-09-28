import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import classNames from 'classnames'
import Select from '../../shared/Select'
import { fetchSelectOptions } from '../../../queries/utils'
import { ORIGIN_SEARCH_QUERY } from '../../../queries/origin'
import Pill from '../../shared/Pill'

export const OriginAutocomplete = ({
  origins,
  setOrigins,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('origin.label') })

  const selectOrigin = (origin) => {
    setOrigins([...origins.filter(({ slug }) => slug !== origin.slug), origin])
  }

  const fetchedOriginsCallback = (data) => (
    data?.origins.map((origin) => ({
      label: origin.name,
      value: origin.id,
      slug: origin.slug
    }))
  )

  return (
    <div className={classNames(containerStyles)} data-testid='origin-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('origin.label') })}
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, ORIGIN_SEARCH_QUERY, fetchedOriginsCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('origin.header') })}
        onChange={selectOrigin}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const OriginFilters = (props) => {
  const { origins, setOrigins } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeOrigin = (originSlug) => {
    setOrigins(origins.filter(({ slug }) => slug !== originSlug))
  }

  return (
    <>
      {origins?.map((origin, originIdx) => (
        <div className='py-1' key={originIdx}>
          <Pill
            key={`filter-${originIdx}`}
            label={`${format('origin.label')}: ${origin.label}`}
            onRemove={() => removeOrigin(origin.slug)}
          />
        </div>
      ))}
    </>
  )
}
