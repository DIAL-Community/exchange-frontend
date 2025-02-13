import { useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CollectionPageSize, FilterContext } from '../../context/FilterContext'
import Pagination from '../../shared/Pagination'
import { ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/organization'
import ListStructure from './ListStructure'
import OrganizationSearchBar from './OrganizationSearchBar'

const OrganizationListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    aggregator,
    collectionDisplayType,
    endorser,
    sectors,
    countries,
    years,
    search
  } = useContext(FilterContext)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query
  const pageNumber = page ? parseInt(page) - 1 : 0
  const pageOffset = pageNumber * CollectionPageSize[collectionDisplayType]

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

  const { loading, error, data } = useQuery(ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      years: years.map(year => year.value),
      aggregatorOnly: aggregator,
      endorserOnly: endorser
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <>
      <OrganizationSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={CollectionPageSize[collectionDisplayType]}
      />
      {loading && format('ui.pagination.loadingInfo')}
      {error && format('ui.pagination.loadingInfoError')}
      {data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeOrganization.totalCount}
          defaultPageSize={CollectionPageSize[collectionDisplayType]}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default OrganizationListRight
