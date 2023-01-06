import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiSortAscending } from 'react-icons/hi'
import { RoleFilterContext } from '../../context/candidate/RoleFilterContext'
import { FilterContext } from '../../context/FilterContext'
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
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
              <div className='hidden xl:block col-span-3 text-sm font-semibold opacity-50'>
                {format('candidate.role.description').toUpperCase()}
                <HiSortAscending className='hidden ml-1 inline text-2xl' />
              </div>
            </div>
        }
        {
          props.roleList.length > 0
            ? props.roleList.map((role) => (
              <RoleCard key={role.id} listType={displayType} {...{ filterDisplayed, role }} />
            ))
            : (
              <div className='flex justify-self-center text-dial-gray-dark'>{
                format('noResults.entity', { entity: format('candidate.role.label').toLowerCase() })
              }
              </div>
            )
        }
      </div>
    </>
  )
}

const RoleListQuery = ({ displayType }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { search } = useContext(RoleFilterContext)
  const { filterDisplayed, resultCounts, setResultCounts } = useContext(FilterContext)

  const { loading, error, data, fetchMore } = useQuery(ROLES_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search
    },
    onCompleted: (data) => {
      setResultCounts({ ...resultCounts, ...{ [['filter.entity.candidateRoles']]: data.searchCandidateRoles.totalCount } })
    }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  const { searchCandidateRoles: { nodes, pageInfo } } = data

  function handleLoadMore () {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
        search
      }
    })
  }

  return (
    <InfiniteScroll
      className='relative px-2 mt-3 pb-8 infinite-scroll-default-height'
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
