import { useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ResourceFilterContext } from '../../context/ResourceFilterContext'
import Pagination from '../../shared/Pagination'
import { RESOURCE_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/resource'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import ListStructure from './ListStructure'
import ResourceSearchBar from './ResourceSearchBar'

const ResourceListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search, resourceTypes, resourceTopics, resourceTags, resourceCountries } = useContext(ResourceFilterContext)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query
  const pageNumber = page ? parseInt(page) - 1 : 0
  const pageOffset = pageNumber * DEFAULT_PAGE_SIZE

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    push(
      { query: { ...query, page: destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
    if (topRef && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const { loading, error, data } = useQuery(RESOURCE_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      tags: resourceTags.map(r => r.label),
      countries: resourceCountries.map(r => r.value),
      resourceTypes: resourceTypes.map(r => r.label),
      resourceTopics: resourceTopics.map(r => r.label)
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <>
      <ResourceSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeResource.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default ResourceListRight
