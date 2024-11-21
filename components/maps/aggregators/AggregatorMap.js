import { useCallback, useContext, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { AGGREGATORS_QUERY, CAPABILITIES_QUERY, COUNTRIES_QUERY, OPERATORS_QUERY } from '../../shared/query/map'
import CountryInfo from './CountryInfo'

const CountryMarkersMaps = (props) => {
  const CountryMarkersMaps = useMemo(() => dynamic(
    () => import('./CountryMarkers'),
    { ssr: false }
  ), [])

  return <CountryMarkersMaps {...props} />
}

const DEFAULT_PAGE_SIZE = 10000

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
  const { aggregators, operators, services } = useContext(FilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading: loadingAggregators, data: aggregatorData } = useQuery(AGGREGATORS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      aggregatorOnly: true,
      aggregators: aggregators.map(a => a.value)
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  const { loading: loadingCountries, data: countryData } = useQuery(COUNTRIES_QUERY, {
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

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
    skip: skipQuery(operators, services),
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  const { loading: loadingOperatorServiceData, data: operatorServiceData } = useQuery(OPERATORS_QUERY, {
    variables: {
      operators: operators.map(o => o.value)
    },
    skip: skipQuery(operators, services),
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
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
  const loading = loadingCapabilityData || loadingOperatorServiceData || loadingAggregators || loadingCountries

  return (
    <div className='min-h-[10vh]'>
      <div className='flex flex-row bg-dial-iris-blue rounded-md relative'>
        {loading &&
          <div className='absolute right-4 px-3 py-2 rounded-md' style={{ zIndex: 19 }}>
            <div className='text-dial-stratos text-sm'>
              {format('map.loading.indicator')}
            </div>
          </div>
        }
        <CountryMarkersMaps
          countries={countriesWithAggregators}
          setSelectedCountry={setSelectedCountry}
        />
        <CountryInfo country={country} />
      </div>
    </div>
  )
}

export default AggregatorMap
