import { useCallback, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import NotFound from '../shared/NotFound'
import { useUser } from '../../lib/hooks'
import { Loading, Error } from '../shared/FetchStatus'
import { FilterContext } from '../context/FilterContext'
import { PlaybookFilterContext } from '../context/PlaybookFilterContext'
import { PLAYBOOKS_QUERY } from '../../queries/playbook'
import PlaybookCard from './PlaybookCard'

const DEFAULT_PAGE_SIZE = 20
const PlaybookList = (props) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser } = useUser()

  const displayType = props.displayType
  const gridStyles = `grid ${displayType === 'card'
    ? 'grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-1'
    }`

  return (
    <div className={gridStyles}>
      {
        displayType === 'list' &&
          <div className='flex flex-col md:flex-row flex-wrap my-3 px-4 gap-x-4'>
            <div className='ml-2 text-sm font-semibold opacity-70'>
              {format('playbook.header').toUpperCase()}
            </div>
            <div className='hidden md:block ml-auto text-sm font-semibold opacity-50'>
              {format('playbooks.tags').toUpperCase()}
            </div>
          </div>
      }
      {
        props.playbookList.length > 0
          ? props.playbookList.map((playbook, index) => (
            <PlaybookCard key={index} listType={displayType} canEdit={isAdminUser} {...{ playbook }}
            />
          ))
          : (
            <div className='text-sm font-medium opacity-80'>
              {format('noResults.entity', { entity: format('playbooks.label').toString().toLowerCase() })}
            </div>
          )
      }
    </div>
  )
}

const PlaybookListQuery = () => {
  const { locale } = useRouter()
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { displayType, setResultCounts } = useContext(FilterContext)
  const { search, tags, products } = useContext(PlaybookFilterContext)

  const { loading, error, data, fetchMore } = useQuery(PLAYBOOKS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      search,
      products: products.map(product => product.value),
      tags: tags.map(tag => tag.label)
    },
    context: { headers: { 'Accept-Language': locale } }
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
        search,
        products: products.map(product => product.value),
        tags: tags.map(tag => tag.label)
      }
    })
  }

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.playbooks']]: data.searchPlaybooks.totalCount }
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

  const { searchPlaybooks: { nodes, pageInfo } } = data

  return (
    <>
      <InfiniteScroll
        className='relative infinite-scroll-default-height'
        dataLength={nodes.length}
        next={handleLoadMore}
        hasMore={pageInfo.hasNextPage}
        loader={<div className='relative text-center mt-3'>{format('general.loadingData')}</div>}
      >
        <PlaybookList playbookList={nodes} displayType={displayType} />
      </InfiniteScroll>
    </>
  )
}

export default PlaybookListQuery
