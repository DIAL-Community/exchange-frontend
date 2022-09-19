import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import classNames from 'classnames'
import Select from '../../shared/Select'
import { ENDORSER_SEARCH_QUERY } from '../../../queries/endorser'
import { fetchSelectOptions } from '../../../queries/utils'
import Pill from '../../shared/Pill'

export const EndorserAutocomplete = ({
  endorsers,
  setEndorsers,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('endorser.label') })

  const selectEndorser = (endorser) => {
    setEndorsers([...endorsers.filter(({ slug }) => slug !== endorser.slug), endorser])
  }

  const fetchedEndorsersCallback = (data) => (
    data?.endorsers.map((endorser) => ({
      label: endorser.name,
      value: endorser.id,
      slug: endorser.slug
    }))
  )

  return (
    <div className={classNames(containerStyles)}data-testid='endorser-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('endorser.label') })}
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, ENDORSER_SEARCH_QUERY, fetchedEndorsersCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('endorser.header') })}
        onChange={selectEndorser}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const EndorserFilters = (props) => {
  const { endorsers, setEndorsers } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeEndorser = (endorserSlug) => {
    setEndorsers(endorsers.filter(({ slug }) => slug !== endorserSlug))
  }

  return (
    <>
      {endorsers?.map((endorser, endorserIdx) => (
        <div className='py-1' key={endorserIdx}>
          <Pill
            key={`filter-${endorserIdx}`}
            label={`${format('endorser.label')}: ${endorser.label}`}
            onRemove={() => removeEndorser(endorser.slug)}
          />
        </div>
      ))}
    </>
  )
}
