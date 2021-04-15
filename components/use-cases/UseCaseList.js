import { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import InfiniteScroll from 'react-infinite-scroll-component'

import UseCaseCard from './UseCaseCard'
import { UseCaseFilterContext } from '../context/UseCaseFilterContext'
import { FilterResultContext, convertToKey } from '../context/FilterResultContext'

const DEFAULT_PAGE_SIZE = 20

const USE_CASES_QUERY = gql`
query SearchUseCases(
  $first: Int,
  $after: String,
  $sdgs: [String!],
  $showBeta: Boolean
  ) {
  searchUseCases(
    first: $first,
    after: $after,
    sdgs: $sdgs,
    showBeta: $showBeta
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
      useCaseDescriptions {
        description
      }
    }
  }
}
`

const UseCaseList = (props) => {
  return (
    <>
      <div className='row grid grid-cols-4 gap-3'>
        {
          props.useCaseList.map((useCase) => {
            return <UseCaseCard key={useCase.id} useCase={useCase} listType='list'/>
          })
        }
      </div>
    </>
  )
}

const UseCaseListQuery = () => {
  const { resultCounts, setResultCounts } = useContext(FilterResultContext)
  const { sdgs, showBeta } = useContext(UseCaseFilterContext)

  const { loading, error, data, fetchMore } = useQuery(USE_CASES_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta: showBeta
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [`${convertToKey('Use Cases')}`]: data.searchUseCases.totalCount } })
    }
  })

  if (loading) {
    return <div>Fetching..</div>
  }
  if (error) {
    return <div>Error!</div>
  }

  const { searchUseCases: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        after: pageInfo.endCursor,
        first: DEFAULT_PAGE_SIZE,
        sdgs: sdgs.map(sdg => sdg.value),
        showBeta: showBeta
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
        <UseCaseList useCaseList={nodes} />
      </div>
    </InfiniteScroll>
  )
}

export default UseCaseListQuery
