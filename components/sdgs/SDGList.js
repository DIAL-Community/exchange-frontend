import { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import SDGCard from './SDGCard'
import { SDGFilterContext } from '../context/SDGFilterContext'
import { FilterResultContext, convertToKey } from '../context/FilterResultContext'

const DEFAULT_PAGE_SIZE = 20

const SDGS_QUERY = gql`
query SearchSDGs(
  $first: Int,
  $after: String,
  $sdgs: [String!]
  ) {
  searchSdgs(
    first: $first,
    after: $after,
    sdgs: $sdgs
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
      longTitle
    }
  }
}
`

const SDGList = (props) => {
  return (
    <>
      <div className='row grid grid-cols-4 gap-3'>
        {
          props.sdgList.map((sdg) => {
            return <SDGCard key={sdg.id} sdg={sdg} />
          })
        }
      </div>
    </>
  )
}

const SDGListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const { sdgs } = useContext(SDGFilterContext)

  const { loading, error, data, fetchMore } = useQuery(SDGS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(organization => organization.value)
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [`${convertToKey('SDGs')}`]: data.searchSdgs.totalCount } })
    }
  })

  if (loading) {
    return <div>Fetching..</div>
  }
  if (error) {
    return <div>Error!</div>
  }

  const { searchSdgs: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value)
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
        <SDGList sdgList={nodes} />
      </div>
    </InfiniteScroll>
  )
}

export default SDGListQuery
