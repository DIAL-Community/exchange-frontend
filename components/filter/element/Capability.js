import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import Select from '../../shared/Select'
import { fetchSelectOptions } from '../../../queries/utils'
import { CAPABILITY_SEARCH_QUERY } from '../../../queries/capability'
import Pill from '../../shared/Pill'
import { compareAlphabetically } from '../../shared/compareAlphabetically'

export const CapabilityAutocomplete = ({
  services,
  setServices,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('service.label') })

  const selectCapability = (service) => {
    setServices([...services.filter(c => c.value !== service.value), service])
  }

  const fetchedCapabilityCallback = (data) => (
    data?.capabilityOnly
      .map((service) => ({
        label: `${service.service} - ${service.capability}`,
        value: `${service.service} - ${service.capability}`
      }))
      .sort(compareAlphabetically)
  )

  return (
    <div className={classNames(containerStyles)} data-testid='service-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('service.label') })}
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, CAPABILITY_SEARCH_QUERY, fetchedCapabilityCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('service.header') })}
        onChange={selectCapability}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const CapabilityFilters = (props) => {
  const { services, setServices } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeCapability = (serviceSlug) => {
    setServices(services.filter(({ slug }) => slug !== serviceSlug))
  }

  return (
    <>
      {services?.map((service, serviceIdx) => ( 
        <div className='py-1' key={serviceIdx}>
          <Pill
            key={`filter-${serviceIdx}`}
            label={`${format('service.label')}: ${service.label}`}
            onRemove={() => removeCapability(service.slug)}
          />
        </div>
      ))}
    </>
  )
}
