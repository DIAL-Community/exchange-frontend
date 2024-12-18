import { useCallback, useContext, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { COUNTRIES_QUERY, PROJECTS_QUERY } from '../../shared/query/map'
import CountryInfo from './CountryInfo'

const CountryMarkersMaps = (props) => {
  const CountryMarkersMaps = useMemo(() => dynamic(
    () => import('./CountryMarkers'),
    { ssr: false }
  ), [])

  return <CountryMarkersMaps {...props} />
}

const DEFAULT_PAGE_SIZE = 10000

const ProjectMap = () => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const { sectors, tags, products } = useContext(FilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading: loadingProjects, data: projectData } = useQuery(PROJECTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      products: products.map(product => product.value)
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
          currentCountry?.projects.push({ name: project.name, slug: project.slug })
        })
      })
    }

    return countriesWithProjects
  })()

  const country = countriesWithProjects[selectedCountry]
  const loading = loadingProjects || loadingCountries

  return (
    <div className='min-h-[10vh]'>
      <div className='flex flex-row bg-dial-iris-blue rounded-md relative'>
        {loading &&
          <div className='absolute right-3 px-3 py-2 text-sm' style={{ zIndex: 19 }}>
            <div className='text-sm text-dial-stratos'>
              {format('map.loading.indicator')}
            </div>
          </div>
        }
        <CountryMarkersMaps
          countries={countriesWithProjects}
          setSelectedCountry={setSelectedCountry}
        />
        <CountryInfo country={country} />
      </div>
    </div>
  )
}

export default ProjectMap
