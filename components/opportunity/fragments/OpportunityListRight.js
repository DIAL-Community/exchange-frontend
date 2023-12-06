import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useCallback, useContext, useRef } from 'react'
import { OpportunityFilterContext, OpportunityFilterDispatchContext } from '../../context/OpportunityFilterContext'
import { OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/opportunity'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import Pagination from '../../shared/Pagination'
import ListStructure from './ListStructure'
import OpportunitySearchBar from './OpportunitySearchBar'

const OpportunityListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    search,
    countries,
    buildingBlocks,
    organizations,
    useCases,
    sectors,
    tags,
    showClosed,
    showGovStackOnly
  } = useContext(OpportunityFilterContext)

  const { pageNumber, pageOffset } = useContext(OpportunityFilterContext)
  const { setPageNumber, setPageOffset } = useContext(OpportunityFilterDispatchContext)

  const topRef = useRef(null)

  const handlePageClick = (event) => {
    setPageNumber(event.selected)
    setPageOffset(event.selected * DEFAULT_PAGE_SIZE)

    if (topRef && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const { loading, error, data } = useQuery(OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      organizations: organizations.map(organization => organization.value),
      useCases: useCases.map(useCase => useCase.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      showClosed,
      showGovStackOnly
    }
  })

  return (
    <>
      <OpportunitySearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeOpportunity.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          pageClickHandler={handlePageClick}
        />
      }
    </>
  )
}

export default OpportunityListRight
