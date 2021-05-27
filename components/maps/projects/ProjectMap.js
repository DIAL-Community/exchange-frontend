import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { FormattedMessage } from 'react-intl'

import CountryInfo from './CountryInfo'

const CountryMarkers = (props) => {
  const CountryMarkers = useMemo(() => dynamic(
    () => import('./CountryMarkers'),
    {
      loading: () => <div><FormattedMessage id='map.project.loadingData' /></div>,
      ssr: false
    }
  ), [])
  return <CountryMarkers {...props} />
}

const ProjectMap = (props) => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const { projects, countries } = props

  // Group project into map of countries with projects
  const countriesWithProjects = (() => {
    const countriesWithProjects = {}
    countries.forEach(country => {
      countriesWithProjects[country.name] = {
        name: country.name,
        latitude: country.latitude,
        longitude: country.longitude,
        projects: []
      }
    })

    projects.forEach(project => {
      project.countries.forEach(country => {
        const currentCountry = countriesWithProjects[country.name]
        currentCountry.projects.push({ name: project.name, slug: project.slug })
      })
    })
    return countriesWithProjects
  })()

  const country = countriesWithProjects[selectedCountry]

  return (
    <div className='flex flex-row mx-2 my-2'>
      <CountryMarkers countries={countriesWithProjects} setSelectedCountry={setSelectedCountry} />
      <CountryInfo country={country} />
    </div>
  )
}

export default ProjectMap
