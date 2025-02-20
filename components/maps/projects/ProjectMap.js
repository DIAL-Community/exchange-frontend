import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { PROJECTS_MAP_QUERY } from '../../shared/query/map'
import CountryInfo from './CountryInfo'

const ProjectMap = ({ initialCountry }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [selectedCountryName, setSelectedCountryName] = useState('')
  const { sectors, tags, products } = useContext(FilterContext)

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

  const ProjectLeaflet = useMemo(() => dynamic(
    () => import('./ProjectLeaflet'),
    { ssr: false }
  ), [])

  const { loading, data } = useQuery(PROJECTS_MAP_QUERY, {
    variables: {
      search: '',
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

  // Assign projects to the country. Creating map of countries with projects.
  // {
  //   "Afghanistan": {
  //     "name": "Afghanistan",
  //     "latitude": 33,
  //     "longitude": 65,
  //     "projects": [
  //       {
  //         "name": "Project 1",
  //         "slug": "project-1"
  //       }
  //     ]
  //   },
  //   ...
  // }
  const countriesWithProjects = (() => {
    const countriesWithProjects = {}
    if (data) {
      const { countries } = data
      countries.forEach(country => {
        countriesWithProjects[country.name] = {
          name: country.name,
          latitude: country.latitude,
          longitude: country.longitude,
          projects: []
        }
      })

      const { searchProjects: projects } = data
      projects.forEach(project => {
        project.countries.forEach(country => {
          const currentCountry = countriesWithProjects[country.name]
          currentCountry?.projects.push({ name: project.name, slug: project.slug })
        })
      })
    }

    return countriesWithProjects
  })()

  const country = countriesWithProjects[selectedCountryName]

  return (
    <div className='project-map w-full h-full' ref={observedElementRef}>
      <div className='flex flex-row relative h-full'>
        {loading &&
          <div className='absolute right-3 px-3 py-2 text-sm' style={{ zIndex: 19 }}>
            <div className='text-sm text-dial-stratos'>
              {format('map.loading.indicator')}
            </div>
          </div>
        }
        <ProjectLeaflet
          initialCountry={initialCountry}
          containerHeight={containerHeight}
          countriesWithProjects={countriesWithProjects}
          setSelectedCountryName={setSelectedCountryName}
        />
        <CountryInfo country={country} />
      </div>
    </div>
  )
}

export default ProjectMap
