import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import { gql, useQuery } from '@apollo/client'
import EndorserCard from '../../../components/organization/EndorserCard'
import { FilterContext } from '../../../components/context/FilterContext'
import SearchFilter from '../../../components/shared/SearchFilter'
import PoweredBy from '../../../components/shared/PoweredBy'
import { CountryAutocomplete, CountryActiveFilters } from '../../../components/shared/filter/Country'
import { EndorsingYearSelect, EndorsingYearActiveFilters } from '../../../components/shared/filter/EndorsingYear'
import { SectorAutocomplete, SectorActiveFilters } from '../../../components/shared/filter/Sector'
import EndorserInfo from '../../../components/maps/endorsers/EndorserInfo'
import ClientOnly from '../../../lib/ClientOnly'

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
  $search: String!
) {
  searchOrganizations(
    sectors: $sectors,
    countries: $countries,
    endorserOnly: $endorserOnly,
    endorserLevel: $endorserLevel,
    years: $years,
    search: $search
  ) {
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

const EndorserPageInformation = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [selectedCity, setSelectedCity] = useState('')
  const [organization, setOrganization] = useState()
  const [search, setSearch] = useState('')
  const [endorserLevel, setEndorserLevel] = useState('')
  const [countries, setCountries] = useState([])
  const [years, setYears] = useState([])
  const [sectors, setSectors] = useState([])

  const { setResultCounts, displayType } = useContext(FilterContext)

  const toggleEndorserLevel = () => {
    setEndorserLevel(endorserLevel === 'gold' ? '' : 'gold')
  }

  const { data } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      endorserOnly: true,
      sectors: sectors.map(sector => sector.value),
      years: years.map(year => year.value),
      countries: countries.map(country => country.value),
      endorserLevel,
      search
    }
  })

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.organizations']]: data.searchOrganizations.totalCount }
        }
      })
    }
  }, [data, setResultCounts])

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

  const gridStyles = `grid
    ${
      displayType === 'card'
        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'
        : 'grid-cols-1'
    }
  `

  return (
    <>
      <div className='flex flex-row mx-2 my-2' style={{ minHeight: '10vh' }}>
        <EndorserMarkerMaps
          {...{ cities, organization, setSelectedCity, setOrganization, height: '30vh', defaultMap: 'principles' }}
        />
        <EndorserInfo {...{ city, setOrganization }} />
      </div>
      <div className='flex flex-row bg-dial-gray-dark py-3'>
        <div className='text-white text-xl flex justify-center items-center mx-5'>
          <div className='whitespace-nowrap'>Filter Endorsers</div>
        </div>
        <div className='text-sm text-dial-gray-light flex flex-row flex-wrap w-full'>
          <EndorsingYearSelect {...{ years, setYears }} containerStyles='px-2 pb-2' />
          <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' />
          <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' />
          <div className='flex justify-center items-center mx-5'>
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
      {
        (years.length > 0 || countries.length > 0 || sectors.length > 0) &&
          <div className='flex flex-row bg-dial-gray-dark px-5 pb-3 gap-2'>
            <EndorsingYearActiveFilters {...{ years, setYears }} />
            <CountryActiveFilters {...{ countries, setCountries }} />
            <SectorActiveFilters {...{ sectors, setSectors }} />
          </div>
      }
      <div className='grid grid-cols-4'>
        <div className='grid col-span-3 mb-2'>
          <SearchFilter {...{ search, setSearch }} hint='filter.entity.organizations' />
        </div>
        <div className='grid items-center justify-self-end mr-2'>
          <PoweredBy />
        </div>
      </div>
      <div className={gridStyles}>
        {
          data && data.searchOrganizations && data.searchOrganizations.nodes && data.searchOrganizations.nodes.length > 0
            ? data.searchOrganizations.nodes.map((organization) => (
              <EndorserCard key={organization.id} organization={organization} listType={displayType} />
            ))
            : (
              <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-3'>
                {format('noResults.entity', { entity: format('ui.organization.label').toLowerCase() })}
              </div>
            )
        }
      </div>
    </>
  )
}

const EndorserPage = () => {
  return (
    <ClientOnly clientTenants={['default', 'fao']}>
      <EndorserPageInformation />
    </ClientOnly>
  )
}

export default EndorserPage
