import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import classNames from 'classnames'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'
import { SDG_SEARCH_QUERY } from '../../../queries/sdg'
import { fetchSelectOptions } from '../../../queries/utils'

export const SDGAutocomplete = ({
  sdgs,
  setSDGs,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('sdg.shortLabel') })

  const selectSDG = (sdg) => {
    setSDGs([...sdgs.filter(s => s.value !== sdg.value), sdg])
  }

  const fetchedSdgsCallback = (data) => (
    data?.sdgs.map((sdg) => ({
      label: `${sdg.number}. ${sdg.name}`,
      value: sdg.id,
      slug: sdg.slug
    }))
  )

  return (
    <div className={classNames(containerStyles)} data-testid='sdg-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('sdg.shortLabel') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, SDG_SEARCH_QUERY, fetchedSdgsCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('sdg.shortHeader') })}
        onChange={selectSDG}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const SDGFilters = (props) => {
  const { sdgs, setSDGs } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeSDG = (sdgId) => {
    setSDGs(sdgs.filter(sdg => sdg.value !== sdgId))
  }

  return (
    <>
      {sdgs?.map((sdg, sdgIdx) => (
        <div className='py-1' key={sdgIdx}>
          <Pill
            key={`filter-${sdgIdx}`}
            label={`${format('sdg.shortLabel')}: ${sdg.label}`}
            onRemove={() => removeSDG(sdg.value)}
          />
        </div>
      ))}
    </>
  )
}
