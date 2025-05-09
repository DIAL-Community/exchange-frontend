import { useCallback, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { CollectionPageSize, FilterContext } from '../../context/FilterContext'
import Pagination from '../../shared/Pagination'
import { BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/buildingBlock'
import BuildingBlockSearchBar from './BuildingBlockSearchBar'
import ListStructure from './ListStructure'

const BuildingBlockListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    search,
    collectionDisplayType,
    sdgs,
    useCases,
    workflows,
    categoryTypes,
    showMature,
    showGovStackOnly
  } = useContext(FilterContext)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { 'building-block-page': buildingBlockPage } = query
  const pageNumber = buildingBlockPage ? parseInt(buildingBlockPage) - 1 : 0
  const pageOffset = pageNumber * CollectionPageSize[collectionDisplayType]

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    push(
      { query: { ...query, 'building-block-page': destinationPage + 1 } },
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

  const { loading, error, data } = useQuery(BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
      workflows: workflows.map(workflow => workflow.value),
      categoryTypes: categoryTypes.map(categoryType => categoryType.value),
      showMature,
      showGovStackOnly
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <>
      <BuildingBlockSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        pageSize={CollectionPageSize[collectionDisplayType]}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeBuildingBlock.totalCount}
          defaultPageSize={CollectionPageSize[collectionDisplayType]}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default BuildingBlockListRight
