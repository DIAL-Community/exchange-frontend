import { useMemo, useState } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import dynamic from 'next/dynamic'

import gql from 'graphql-tag'

import CountryInfo from './CountryInfo'
import { useQuery } from '@apollo/client'

const CountryMarkers = (props) => {
  const CountryMarkers = useMemo(() => dynamic(
    () => import('./CountryMarkers'),
    {
      loading: () => <div><FormattedMessage id='map.aggregator.loadingData' /></div>,
      ssr: false
    }
  ), [])
  return <CountryMarkers {...props} />
}

const CAPABILITIES_QUERY = gql`
  query Capabilities(
    $search: String,
    $capabilities: [String!],
    $services: [String!]
  ) {
    capabilities(
      search: $search,
      capabilities: $capabilities,
      services: $services
    ) {
      service
      capability
      countryId
      aggregatorId
      operatorServiceId
    }
  }
`

const OPERATORS_QUERY = gql`
  query OperatorServices(
    $search: String,
    $operators: [String!]
  ) {
    operatorServices(
      search: $search,
      operators: $operators
    ) {
      id
      name
      countryId
    }
  }
`

const skipQuery = (operators, services) => {
  if (!operators && !services) {
    // skip query if we don't have operators and services parameters available.
    return true
  }

  if (operators.length <= 0 && services.length <= 0) {
    // skip query if operators and services don't have data
    return true
  }

  return false
}

const AggregatorMap = (props) => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const { aggregators, countries, operators, services } = props

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const serviceNames = []
  const capabilityNames = []
  services.forEach(service => {
    const [serviceName, capabilityName] = service.value.split(' - ')
    serviceNames.push(serviceName)
    capabilityNames.push(capabilityName)
  })

  const { loading: loadingCapabilityData, data: capabilityData } = useQuery(CAPABILITIES_QUERY, {
    variables: {
      services: serviceNames,
      capabilities: capabilityNames
    },
    skip: skipQuery(operators, services)
  })

  const { loading: loadingOperatorServiceData, data: operatorServiceData } = useQuery(OPERATORS_QUERY, {
    variables: {
      operators: operators.map(o => o.value)
    },
    skip: skipQuery(operators, services)
  })

  // Group project into map of countries with projects
  const countriesWithAggregators = (() => {
    const countriesWithAggregators = {}
    countries.forEach(country => {
      countriesWithAggregators[country.id] = {
        name: country.name,
        latitude: country.latitude,
        longitude: country.longitude,
        aggregators: []
      }
    })

    if (capabilityData && operatorServiceData) {
      // Create map of aggregator to get the aggregator information.
      const aggregatorData = {}
      aggregators.forEach(aggregator => {
        aggregatorData[aggregator.id] = aggregator
      })

      // Make sure all operator ids are unique.
      const operatorIds = operatorServiceData.operatorServices
        .map(operatorService => operatorService.id)
        .filter((value, index, self) => self.indexOf(value) === index)

      // This will be used as base of our markers.
      const aggregatorCountryList = capabilityData.capabilities
        // Filter using the operator service id above.
        .filter(capability => {
          return operatorIds.indexOf(capability.operatorServiceId.toString()) >= 0
        })
        // Create map of aggregator and country based on the filtered capabilities.
        .map(capability => {
          return { aggregatorId: capability.aggregatorId, countryId: capability.countryId }
        })
        // Remove the duplicates from above.
        .filter((value, index, self) =>
          index === self.findIndex((t) =>
            t.aggregatorId === value.aggregatorId && t.countryId === value.countryId)
        )

      aggregatorCountryList.forEach(aggregatorCountry => {
        const currentCountry = countriesWithAggregators[aggregatorCountry.countryId]
        const currentAggregator = aggregatorData[aggregatorCountry.aggregatorId]
        if (currentAggregator) {
          currentCountry.aggregators.push({ name: currentAggregator.name, slug: currentAggregator.slug })
        }
      })
    } else {
      aggregators.forEach(aggregator => {
        aggregator.countries.forEach(country => {
          const currentCountry = countriesWithAggregators[country.id]
          currentCountry.aggregators.push({ name: aggregator.name, slug: aggregator.slug })
        })
      })
    }
    return countriesWithAggregators
  })()

  const country = countriesWithAggregators[selectedCountry]

  return (
    <div className='flex flex-row mx-2 my-2'>
      {
        (loadingCapabilityData || loadingOperatorServiceData) &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm' style={{ zIndex: 19 }}>
            {format('map.loading.indicator')} &hellip;
          </div>
      }
      <CountryMarkers countries={countriesWithAggregators} setSelectedCountry={setSelectedCountry} />
      <CountryInfo country={country} />
    </div>
  )
}

export default AggregatorMap
