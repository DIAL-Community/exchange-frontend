import { useContext, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'

import EndorserInfo from './EndorserInfo'
import { MapFilterContext } from '../../context/MapFilterContext'
import { gql, useQuery } from '@apollo/client'

const EndorserMarkerMaps = (props) => {
  const EndorserMarkerMaps = useMemo(() => dynamic(
    () => import('./EndorserMarkers'),
    { ssr: false }
  ), [])
  return <EndorserMarkerMaps {...props} />
}

const DEFAULT_PAGE_SIZE = 1000
const ORGANIZATIONS_QUERY = gql`
query SearchOrganizations(
  $first: Int,
  $sectors: [String!],
  $years: [Int!],
) {
  searchOrganizations(
    first: $first,
    sectors: $sectors,
    years: $years
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
      website
      whenEndorsed
      countries {
        name
        slug
        latitude
        longitude
      }
      offices {
        id
        name
        latitude
        longitude
      }
    }
  }
}
`

const EndorserMap = () => {
  const [selectedCity, setSelectedCity] = useState('')
  const [organization, setOrganization] = useState()
  const { orgSectors, years } = useContext(MapFilterContext)

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { loading, data } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sectors: orgSectors.map(sector => sector.value),
      years: years.map(year => year.value)
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
    <div className='flex flex-row mx-2 my-2' style={{ minHeight: '10vh' }}>
      {
        loading &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm' style={{ zIndex: 19 }}>
            {format('map.loading.indicator')}
          </div>
      }
      <EndorserMarkerMaps {...{ cities, organization, setSelectedCity, setOrganization }} />
      <EndorserInfo {...{ city, setOrganization }} />
    </div>
  )
}

export default EndorserMap
