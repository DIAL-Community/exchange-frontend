import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { OpportunityFilterContext } from '../../../../components/context/OpportunityFilterContext'
import { OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/opportunity'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import Pagination from '../../shared/Pagination'
import ListStructure from './ListStructure'
import OpportunitySearchBar from './OpportunitySearchBar'

const OpportunityListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(OpportunityFilterContext)
  const {
    buildingBlocks,
    countries,
    organizations,
    sectors,
    useCases,
    tags,
    showClosed
  } = useContext(OpportunityFilterContext)

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)
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

  useEffect(() => {
    setPageNumber(0)
    setPageOffset(0)
  }, [search, useCases, buildingBlocks, sectors, tags])

  const { loading, error, data } = useQuery(OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      organizations: organizations.map(organization => organization.value),
      useCases: useCases.map(useCase => useCase.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      showClosed
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
