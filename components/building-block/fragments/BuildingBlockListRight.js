import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useRef } from 'react'
import { BuildingBlockFilterContext } from '../../context/BuildingBlockFilterContext'
import { BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/buildingBlock'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'
import Pagination from '../../shared/Pagination'
import ListStructure from './ListStructure'
import BuildingBlockSearchBar from './BuildingBlockSearchBar'

const BuildingBlockListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showMature, showGovStackOnly } = useContext(BuildingBlockFilterContext)
  const { search, sdgs, useCases, workflows, categoryTypes } = useContext(BuildingBlockFilterContext)

  const { pageNumber, pageOffset } = useContext(BuildingBlockFilterContext)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const onClickHandler = ({ nextSelectedPage }) => {
    const destinationPage = nextSelectedPage ? nextSelectedPage : 0
    push(
      { query: { ...query, page: destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
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
    }
  })

  return (
    <>
      <BuildingBlockSearchBar ref={topRef} />
      <ListStructure
        pageOffset={pageOffset}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
      { loading && format('ui.pagination.loadingInfo') }
      { error && format('ui.pagination.loadingInfoError') }
      { data &&
        <Pagination
          pageNumber={pageNumber}
          totalCount={data.paginationAttributeBuildingBlock.totalCount}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
        />
      }
    </>
  )
}

export default BuildingBlockListRight
