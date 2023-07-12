import { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { RoleFilterContext } from '../../context/candidate/RoleFilterContext'
import { FilterContext } from '../../context/FilterContext'
import NotFound from '../../shared/NotFound'
import { Loading, Error } from '../../shared/FetchStatus'
import RoleCard from './RoleCard'

const DEFAULT_PAGE_SIZE = 20

const ROLES_QUERY = gql`
  query SearchCandidateRoles(
    $first: Int,
    $after: String,
    $search: String!
    ) {
    searchCandidateRoles(
      first: $first,
      after: $after,
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
        email
        roles
        description
        rejected
        product {
          name
        }
        organization {
          name
        }
        dataset {
          name
        }
      }
    }
  }
`

const RoleList = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const displayType = props.displayType
  const filterDisplayed = props.filterDisplayed
  const gridStyles = `grid ${displayType === 'card'
    ? `grid-cols-1 gap-4
       ${filterDisplayed ? 'md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'}`
    : 'grid-cols-1'
    }`

  return (
    <>
      <div className={gridStyles}>
        {
          props.roleList.length > 0 && displayType === 'list' &&
            <div className='grid grid-cols-12 gap-x-4 my-3 px-4'>
              <div className='col-span-3 ml-2 text-sm font-semibold opacity-70'>
                {format('candidate.role.name').toUpperCase()}
              </div>
            </div>
        }
        {
          props.roleList.length > 0
            ? props.roleList.map((role) => (
              <RoleCard key={role.id} listType={displayType} {...{ filterDisplayed, role }} />
            ))
            : (
              <div className='text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('candidate.role.label').toLowerCase() })
              }
              </div>
            )
        }
      </div>
    </>
  )
}

const RoleListQuery = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { search } = useContext(RoleFilterContext)
  const { filterDisplayed, displayType, setResultCounts } = useContext(FilterContext)

  const { loading, error, data, fetchMore } = useQuery(ROLES_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search
    }
  })

  function handleLoadMore() {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
        search
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.candidateRoles']]: data.searchCandidateRoles.totalCount }
        }
      })
    }
  }, [data, setResultCounts])

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  const { searchCandidateRoles: { nodes, pageInfo } } = data

  return (
    <InfiniteScroll
      className='relative infinite-scroll-default-height'
      dataLength={nodes.length}
      next={handleLoadMore}
      hasMore={pageInfo.hasNextPage}
      loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
    >
      <RoleList roleList={nodes} displayType={displayType} filterDisplayed={filterDisplayed} />
    </InfiniteScroll>
  )
}

export default RoleListQuery
