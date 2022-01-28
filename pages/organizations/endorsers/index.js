import { useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import apolloClient from '../../../lib/apolloClient'

import GradientBackground from '../../../components/shared/GradientBackground'

import OrganizationCard from '../../../components/organizations/OrganizationCard'
import { FilterContext } from '../../../components/context/FilterContext'
import SearchFilter from '../../../components/shared/SearchFilter'
import { CountryAutocomplete, CountryFilters } from '../../../components/filter/element/Country'
import { EndorsingYearFilters, EndorsingYearSelect } from '../../../components/filter/element/EndorsingYear'
import { SectorAutocomplete, SectorFilters } from '../../../components/filter/element/Sector'

import dynamic from 'next/dynamic'

import EndorserInfo from '../../../components/maps/endorsers/EndorserInfo'
import { gql, useQuery } from '@apollo/client'

const EndorserMarkerMaps = (props) => {
  const EndorserMarkerMaps = useMemo(() => dynamic(
    () => import('../../../components/maps/endorsers/EndorserMarkers'),
    { ssr: false }
  ), [])
  return <EndorserMarkerMaps {...props} />
}

const ORGANIZATIONS_QUERY = gql`
query SearchOrganizations(
  $sectors: [String!],
  $countries: [String!],
  $endorserOnly: Boolean!,
  $endorserLevel: String!,
  $years: [Int!],
  $search: String!,
  $mapView: Boolean,
) {
  searchOrganizations(
    sectors: $sectors,
    countries: $countries,
    endorserOnly: $endorserOnly,
    endorserLevel: $endorserLevel,
    years: $years,
    search: $search,
    mapView: $mapView
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
      imageFile
      whenEndorsed
      endorserLevel
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

const EndorserPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [selectedCity, setSelectedCity] = useState('')
  const [organization, setOrganization] = useState()
  const [search, setSearch] = useState('')
  const [endorserLevel, setEndorserLevel] = useState('')
  const [countries, setCountries] = useState([])
  const [years, setYears] = useState([])
  const [sectors, setSectors] = useState([])

  const { displayType } = useContext(FilterContext)

  const toggleEndorserLevel = () => {
    setEndorserLevel(endorserLevel === 'gold' ? '' : 'gold')
  }

  const { data } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      endorserOnly: true,
      sectors: sectors.map(sector => sector.value),
      years: years.map(year => year.value),
      countries: countries.map(country => country.value),
      endorserLevel: endorserLevel,
      search: search,
      mapView: true
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

  const gridStyles = `grid ${displayType === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4' : 'grid-cols-1'}`

  return (
    <>
      <GradientBackground />
      <div className='flex flex-row mx-2 my-2' style={{ minHeight: '10vh' }}>
        <EndorserMarkerMaps {...{ cities, organization, setSelectedCity, setOrganization, height: '30vh', defaultMap: 'principles' }} />
        <EndorserInfo {...{ city, setOrganization }} />
      </div>
      <div className='flex flex-row bg-dial-gray-dark'>
        <div className='text-white text-xl flex justify-center items-center mx-5'><div>Filter Endorsers</div></div>
        <div className='text-sm text-dial-gray-light flex flex-row flex-wrap w-full'>
          <EndorsingYearSelect {...{ years, setYears }} containerStyles='px-2 pb-2' />
          <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' />
          <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' />
          <div className='flex justify-center items-center mx-5 pt-4'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox' className='h-4 w-4 form-checkbox text-white' name='endorser-level'
                checked={endorserLevel === 'gold'} onChange={toggleEndorserLevel}
              />
              <span className='ml-2'>Show only Gold endorsers</span>
            </label>
          </div>
        </div>
      </div>
      <div className='flex flex-row bg-dial-gray-dark py-2 px-5'>
        <EndorsingYearFilters {...{ years, setYears }} />
        <CountryFilters {...{ countries, setCountries }} />
        <SectorFilters {...{ sectors, setSectors }} />
      </div>
      <SearchFilter {...{ search, setSearch }} placeholder={format('app.search') + format('organization.label')} />
      <div className={gridStyles}>
        {
          data && data.searchOrganizations && data.searchOrganizations.nodes && data.searchOrganizations.nodes.map((organization) => (
            <OrganizationCard key={organization.id} organization={organization} listType={displayType} />
          ))
        }
      </div>
    </>
  )
}

export default apolloClient()(EndorserPage)
