import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { ORGANIZATIONS_QUERY } from '../../shared/query/map'
import EndorserInfo from './EndorserInfo'

const EndorserMap = ({ initialCountry }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [selectedCity, setSelectedCity] = useState('')
  const [organization, setOrganization] = useState()
  const { sectors, years } = useContext(FilterContext)

  const EndorserLeaflet = useMemo(() => dynamic(
    () => import('./EndorserLeaflet'),
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

  const { loading, data } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      sectors: sectors.map(sector => sector.value),
      years: years.map(year => year.value)
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  // Group project into map of countries with projects
  const cities = (() => {
    const cities = {}
    if (data) {
      const { searchOrganizations: organizations } = data
      organizations.forEach(organization => {
        organization.offices.forEach(office => {
          let currentCity = cities[office.name]
          if (!currentCity) {
            currentCity = {
              latitude: office.latitude,
              longitude: office.longitude,
              organizations: []
            }
            cities[office.name] = currentCity
          }

          currentCity.organizations.push({
            name: organization.name,
            slug: organization.slug,
            whenEndorsed: organization.whenEndorsed,
            website: organization.website,
            countries: organization.countries
          })
        })
      })
    }

    return cities
  })()

  const city = cities[selectedCity]

  return (
    <div className='endorser-map w-full h-full' ref={observedElementRef}>
      <div className='flex flex-row relative h-full'>
        {loading &&
          <div className='absolute right-3 px-3 py-2 text-sm' style={{ zIndex: 19 }}>
            <div className='text-sm text-dial-stratos'>
              {format('map.loading.indicator')}
            </div>
          </div>
        }
        <EndorserLeaflet
          cities={cities}
          organization={organization}
          initialCountry={initialCountry}
          containerHeight={containerHeight}
          setSelectedCity={setSelectedCity}
          setOrganization={setOrganization}
        />
        <EndorserInfo city={city} setOrganization={setOrganization} />
      </div>
    </div>
  )
}

export default EndorserMap
