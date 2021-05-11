import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

import CountryInfo from './CountryInfo'

const CountryMarkers = (props) => {
  const CountryMarkers = useMemo(() => dynamic(
    () => import('./CountryMarkers'),
    {
      loading: () => <div>Loading Map data ...</div>,
      ssr: false
    }
  ), [])
  return <CountryMarkers {...props} />
}

const AggregatorMap = (props) => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const { aggregators, countries } = props

  // Group project into map of countries with projects
  const countriesWithAggregators = (() => {
    const countriesWithAggregators = {}
    countries.forEach(country => {
      countriesWithAggregators[country.name] = {
        name: country.name,
        latitude: country.latitude,
        longitude: country.longitude,
        aggregators: []
      }
    })

    aggregators.forEach(aggregator => {
      aggregator.countries.forEach(country => {
        const currentCountry = countriesWithAggregators[country.name]
        currentCountry.aggregators.push({ name: aggregator.name, slug: aggregator.slug })
      })
    })
    return countriesWithAggregators
  })()

  const country = countriesWithAggregators[selectedCountry]

  return (
    <div className='flex flex-row mx-2 my-2'>
      <CountryMarkers countries={countriesWithAggregators} setSelectedCountry={setSelectedCountry} />
      <CountryInfo country={country} />
    </div>
  )
}

export default AggregatorMap
