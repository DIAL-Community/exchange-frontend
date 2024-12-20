import { useCallback, useContext, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { ORGANIZATIONS_QUERY } from '../../shared/query/map'
import EndorserInfo from './EndorserInfo'

const EndorserMarkerMaps = (props) => {
  const EndorserMarkerMaps = useMemo(() => dynamic(
    () => import('./EndorserMarkers'),
    { ssr: false }
  ), [])

  return <EndorserMarkerMaps {...props} />
}

const DEFAULT_PAGE_SIZE = 1000

const EndorserMap = () => {
  const [selectedCity, setSelectedCity] = useState('')
  const [organization, setOrganization] = useState()
  const { sectors, years } = useContext(FilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
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
      const { searchOrganizations: { nodes } } = data
      nodes.forEach(organization => {
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
    <div className='min-h-[10vh]'>
      <div className='flex flex-row bg-dial-iris-blue rounded-md relative'>
        {loading &&
          <div className='absolute right-3 px-3 py-2 text-sm' style={{ zIndex: 19 }}>
            <div className='text-sm text-dial-stratos'>
              {format('map.loading.indicator')}
            </div>
          </div>
        }
        <EndorserMarkerMaps {...{ cities, organization, setSelectedCity, setOrganization }} />
        <EndorserInfo {...{ city, setOrganization }} />
      </div>
    </div>
  )
}

export default EndorserMap
