import { useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'

import CountryInfo from './CountryInfo'
import { gql, useQuery } from '@apollo/client'

import { MapFilterContext } from '../../../components/context/MapFilterContext'

const CountryMarkersMaps = (props) => {
  const CountryMarkersMaps = useMemo(() => dynamic(
    () => import('./CountryMarkers'),
    { ssr: false }
  ), [])
  return <CountryMarkersMaps {...props} />
}

const DEFAULT_PAGE_SIZE = 10000

const AGGREGATORS_QUERY = gql`
query SearchOrganizations(
  $first: Int,
  $aggregatorOnly: Boolean,
  $aggregators: [String!],
  $mapView: Boolean
) {
  searchOrganizations(
    first: $first,
    aggregatorOnly: $aggregatorOnly,
    aggregators: $aggregators,
    mapView: $mapView
  ) {
    __typename
    totalCount
    pageInfo {
      endCursor
      startCursor
      hasPreviousPage
      hasNextPage
    }
    nodes {
      id
      name
      slug
      website
      whenEndorsed
      countries {
        id
        name
        slug
        latitude
        longitude
      }
      offices {
        id
        name
        latitude
        longitude
      }
    }
  }
}
`

const COUNTRIES_QUERY = gql`
  query Countries($search: String) {
    countries(search: $search) {
      id
      name
      slug
      latitude
      longitude
    }
  }
`

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

const AggregatorMap = () => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const { aggregators, operators, services } = useContext(MapFilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const fetchAggregatorData = () => {
    const aggregatorData = useQuery(AGGREGATORS_QUERY, {
      variables: {
        first: DEFAULT_PAGE_SIZE,
        mapView: true,
        aggregatorOnly: true,
        aggregators: aggregators.map(a => a.value)
      }
    })
    const countries = useQuery(COUNTRIES_QUERY)

    return [aggregatorData, countries]
  }

  const [
    { loading: loadingAggregators, data: aggregatorData },
    { loading: loadingCountries, data: countryData }
  ] = fetchAggregatorData()

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
    if (countryData) {
      const { countries } = countryData
      countries.forEach(country => {
        countriesWithAggregators[country.id] = {
          name: country.name,
          latitude: country.latitude,
          longitude: country.longitude,
          aggregators: []
        }
      })
    }

    if (aggregatorData) {
      const { searchOrganizations: { nodes } } = aggregatorData
      if (capabilityData && operatorServiceData) {
        // Create map of aggregator to get the aggregator information.
        const aggregatorMap = {}
        nodes.forEach(aggregator => {
          aggregatorMap[aggregator.id] = aggregator
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
          const currentAggregator = aggregatorMap[aggregatorCountry.aggregatorId]
          if (currentAggregator) {
            currentCountry.aggregators.push({ name: currentAggregator.name, slug: currentAggregator.slug })
          }
        })
      } else {
        nodes.forEach(aggregator => {
          aggregator.countries.forEach(country => {
            const currentCountry = countriesWithAggregators[country.id]
            currentCountry.aggregators.push({ name: aggregator.name, slug: aggregator.slug })
          })
        })
      }
    }
    return countriesWithAggregators
  })()

  const country = countriesWithAggregators[selectedCountry]

  return (
    <div className='flex flex-row mx-2 my-2' style={{ minHeight: '10vh' }}>
      {
        (loadingCapabilityData || loadingOperatorServiceData || loadingAggregators || loadingCountries) &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm' style={{ zIndex: 19 }}>
            {format('map.loading.indicator')}
          </div>
      }
      <CountryMarkersMaps countries={countriesWithAggregators} setSelectedCountry={setSelectedCountry} />
      <CountryInfo country={country} />
    </div>
  )
}

export default AggregatorMap
