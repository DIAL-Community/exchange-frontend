import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { AGGREGATORS_MAP_QUERY } from '../../shared/query/map'
import CountryInfo from './CountryInfo'

const AggregatorMap = ({ initialCountry }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [selectedCountryId, setSelectedCountryId] = useState('')
  const { aggregators, operators, services } = useContext(FilterContext)

  const AggregatorLeaflet = useMemo(() => dynamic(
    () => import('./AggregatorLeaflet'),
    { ssr: false }
  ), [])

  const [containerHeight, setContainerHeight] = useState(0)
  const observedElementRef = useRef(null)

  useEffect(() => {
    if (observedElementRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerHeight(entry.contentRect.height)
        }
      })

      observer.observe(observedElementRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  const serviceNames = []
  const capabilityNames = []
  services.forEach(service => {
    const [serviceName, capabilityName] = service.value.split(' - ')
    serviceNames.push(serviceName)
    capabilityNames.push(capabilityName)
  })

  const { loading, data } = useQuery(AGGREGATORS_MAP_QUERY, {
    variables: {
      search: '',
      services: serviceNames,
      capabilities: capabilityNames,
      operators: operators.map(o => o.value),
      aggregatorOnly: true,
      aggregators: aggregators.map(a => a.value)

    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  // Group project into map of countries with projects
  const countriesWithAggregators = (() => {
    const countriesWithAggregators = {}
    if (data) {
      const { countries } = data
      countries.forEach(country => {
        countriesWithAggregators[country.id] = {
          name: country.name,
          latitude: country.latitude,
          longitude: country.longitude,
          aggregators: []
        }
      })

      const { searchOrganizations: organizations, capabilities, operatorServices } = data
      if (capabilities && operatorServices) {
        // Create map of aggregator to get the aggregator information.
        const aggregatorMap = {}
        organizations.forEach(aggregator => {
          aggregatorMap[aggregator.id] = aggregator
        })

        // Make sure all operator ids are unique.
        const operatorIds = operatorServices
          .map(operatorService => operatorService.id)
          .filter((value, index, self) => self.indexOf(value) === index)

        // This will be used as base of our markers.
        const aggregatorCountryList = capabilities
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
        organizations.forEach(aggregator => {
          aggregator.countries.forEach(country => {
            const currentCountry = countriesWithAggregators[country.id]
            currentCountry.aggregators.push({ name: aggregator.name, slug: aggregator.slug })
          })
        })
      }
    }

    return countriesWithAggregators
  })()

  const country = countriesWithAggregators[selectedCountryId]

  return (
    <div className='aggregator-map w-full h-full' ref={observedElementRef}>
      <div className='flex flex-row relative h-full'>
        {loading &&
          <div className='absolute right-4 px-3 py-2 rounded-md' style={{ zIndex: 19 }}>
            <div className='text-dial-stratos text-sm'>
              {format('map.loading.indicator')}
            </div>
          </div>
        }
        <AggregatorLeaflet
          initialCountry={initialCountry}
          containerHeight={containerHeight}
          setSelectedCountryId={setSelectedCountryId}
          countriesWithAggregators={countriesWithAggregators}
        />
        <CountryInfo country={country} />
      </div>
    </div>
  )
}

export default AggregatorMap
