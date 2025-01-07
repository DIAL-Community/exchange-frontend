import { useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import Pagination from '../../shared/Pagination'
import { PLAYBOOK_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/playbook'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import ListStructure from './ListStructure'
import PlaybookSearchBar from './PlaybookSearchBar'

const PlaybookListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search, tags } = useContext(FilterContext)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query
  const pageNumber = page ? parseInt(page) - 1 : 0
  const pageOffset = pageNumber * DEFAULT_PAGE_SIZE

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage === 'undefined' ? selected : nextSelectedPage
    push(
      { query: { ...query, page: destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
    // Scroll to top of the page
    if (topRef && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const { loading, error, data } = useQuery(PLAYBOOK_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      owner: 'public',
      tags: tags.map(tag => tag.label)
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <>
      <PlaybookSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      {loading && format('ui.pagination.loadingInfo')}
      {error && format('ui.pagination.loadingInfoError')}
      {data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributePlaybook.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default PlaybookListRight
