import { useContext, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { FormattedMessage, useIntl } from 'react-intl'

import CountryInfo from './CountryInfo'
import { gql, useQuery } from '@apollo/client'
import { MapFilterContext } from '../../context/MapFilterContext'

const CountryMarkers = (props) => {
  const CountryMarkers = useMemo(() => dynamic(
    () => import('./CountryMarkers'),
    { ssr: false }
  ), [])
  return <CountryMarkers {...props} />
}

const DEFAULT_PAGE_SIZE = 10000
const PROJECTS_QUERY = gql`
query SearchProjects(
  $first: Int,
  $sectors: [String!]
  $tags: [String!]
  ) {
  searchProjects(
    first: $first,
    sectors: $sectors,
    tags: $tags
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
      countries {
        id
        name
        slug
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

const ProjectMap = () => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const { sectors, tags } = useContext(MapFilterContext)

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const fetchProjectData = () => {
    const projects = useQuery(PROJECTS_QUERY, {
      variables: {
        first: DEFAULT_PAGE_SIZE,
        sectors: sectors.map(sector => sector.value),
        tags: tags.map(tag => tag.label),
      }
    })
    const countries = useQuery(COUNTRIES_QUERY)

    return [projects, countries]
  }

  const [
    { loading: loadingProjects, data: projectData },
    { loading: loadingCountries, data: countryData }
  ] = fetchProjectData()

  // Group project into map of countries with projects
  const countriesWithProjects = (() => {
    const countriesWithProjects = {}
    if (countryData) {
      const { countries } = countryData
      countries.forEach(country => {
        countriesWithProjects[country.name] = {
          name: country.name,
          latitude: country.latitude,
          longitude: country.longitude,
          projects: []
        }
      })
    }

    if (projectData) {
      const { searchProjects: { nodes } } = projectData
      nodes.forEach(project => {
        project.countries.forEach(country => {
          const currentCountry = countriesWithProjects[country.name]
          currentCountry.projects.push({ name: project.name, slug: project.slug })
        })
      })
    }
    return countriesWithProjects
  })()

  const country = countriesWithProjects[selectedCountry]

  return (
    <div className='flex flex-row mx-2 my-2' style={{ minHeight: '10vh' }}>
      {
        (loadingProjects || loadingCountries) &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm' style={{ zIndex: 19 }}>
            {format('map.loading.indicator')}
          </div>
      }
      <CountryMarkers countries={countriesWithProjects} setSelectedCountry={setSelectedCountry} />
      <CountryInfo country={country} />
    </div>
  )
}

export default ProjectMap
