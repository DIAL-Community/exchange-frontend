import { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import OrganizationCard from './OrganizationCard'
import { OrganizationFilterContext } from '../context/OrganizationFilterContext'
import { FilterResultContext, convertToKey } from '../context/FilterResultContext'

const DEFAULT_PAGE_SIZE = 20

const ORGANIZATIONS_QUERY = gql`
query SearchOrganizations(
  $first: Int,
  $after: String,
  $sectors: [String!],
  $countries: [String!]
  ) {
  searchOrganizations(
    first: $first,
    after: $after,
    sectors: $sectors,
    countries: $countries
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
      imageFile
      organizationDescriptions {
        description
      }
    }
  }
}
`

const OrganizationList = (props) => {
  return (
    <>
      <div className='row grid grid-cols-4 gap-3'>
        {
          props.organizationList.map((organization) => {
            return <OrganizationCard key={organization.id} organization={organization} listType='list' />
          })
        }
      </div>
    </>
  )
}

const OrganizationListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const { countries, sectors } = useContext(OrganizationFilterContext)

  const { loading, error, data, fetchMore } = useQuery(ORGANIZATIONS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value)
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [`${convertToKey('Organizations')}`]: data.searchOrganizations.totalCount } })
    }
  })

  if (loading) {
    return <div>Fetching..</div>
  }
  if (error) {
    return <div>Error!</div>
  }

  const { searchOrganizations: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        countries: countries.map(country => country.value),
        sectors: sectors.map(sector => sector.value)
      }
    })
  }
  return (
    <InfiniteScroll
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div>Loading...</div>}
    >
      <div id='content' className='container-fluid with-header p-3'>
        <OrganizationList organizationList={nodes} />
      </div>
    </InfiniteScroll>
  )
}

export default OrganizationListQuery
