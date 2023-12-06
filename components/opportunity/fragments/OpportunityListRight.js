import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { OpportunityFilterContext } from '../../context/OpportunityFilterContext'
import { OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/opportunity'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import Pagination from '../../shared/Pagination'
import OpportunitySearchBar from './OpportunitySearchBar'
import ListStructure from './ListStructure'

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

  const [ pageNumber, setPageNumber ] = useState(0)
  const [ pageOffset, setPageOffset ] = useState(0)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * DEFAULT_PAGE_SIZE)
    }
  }, [page, setPageNumber, setPageOffset])

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
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
          pageClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default OpportunityListRight
