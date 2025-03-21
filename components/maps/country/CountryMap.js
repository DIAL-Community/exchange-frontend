import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { COUNTRY_PROJECTS_QUERY } from '../../shared/query/map'
import LocationInfo from './LocationInfo'

const CountryMap = ({ initialCountry }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [selectedLocation, setSelectedLocation] = useState('')
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

  const { loading, data } = useQuery(COUNTRY_PROJECTS_QUERY, {
    variables: {
      search: '',
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      products: products.map(product => product.value),
      country: initialCountry?.name
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
  const locationsWithProjects = (() => {
    const locationsWithProjects = {}
    if (data) {
      const { searchCountryProjects: projects } = data

      projects.forEach(project => {
        if (!project.location) {
          if (!locationsWithProjects[initialCountry.name]) {
            locationsWithProjects[initialCountry.name] = {
              name: initialCountry.name,
              latitude: initialCountry.latitude,
              longitude: initialCountry.longitude,
              projects: []
            }
          }
        }

        if (!locationsWithProjects[project.location]) {
          locationsWithProjects[project.location] = {
            name: project.location,
            projects: []
          }
        }
      })

      projects.forEach(project => {
        let currentLocation = locationsWithProjects[initialCountry.name]
        if (project.location) {
          currentLocation = locationsWithProjects[project.location]
        }

        currentLocation?.projects.push({ name: project.name,
          slug: project.slug,
          latitude: project.location ? project.latitude : currentLocation.latitude,
          longitude: project.location ? project.longitude : currentLocation.longitude
        })
      })
    }

    return locationsWithProjects
  })()

  const location = locationsWithProjects[selectedLocation]

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
          countryProjects={locationsWithProjects}
          setSelectedLocation={setSelectedLocation}
        />
        <LocationInfo location={location} />
      </div>
    </div>
  )
}

export default CountryMap
