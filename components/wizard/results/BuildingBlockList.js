import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import BuildingBlockCard from '../../building-block/BuildingBlockCard'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import Pagination from '../../shared/Pagination'
import { WIZARD_BUILDING_BLOCKS_QUERY } from '../../shared/query/wizard'
import { DisplayType } from '../../utils/constants'
import { WizardContext } from '../WizardContext'

const BuildingBlockList = ({ headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const DEFAULT_PAGE_SIZE = 5
  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const handlePageClick = (event) => {
    setPageNumber(event.selected)
    setPageOffset(event.selected * DEFAULT_PAGE_SIZE)
  }

  const { sdgs, useCases, buildingBlocks: filterBlocks } = useContext(WizardContext)
  const { loading, error, data } = useQuery(WIZARD_BUILDING_BLOCKS_QUERY, {
    variables: {
      sdgs: sdgs.map(sdg => sdg.value),
      useCases: useCases.map(useCase => useCase.value),
      filterBlocks,
      limit: DEFAULT_PAGE_SIZE,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedBuildingBlocks && !data.paginationAttributeBuildingBlock) {
    return <NotFound />
  }

  const {
    paginatedBuildingBlocks: buildingBlocks,
    paginationAttributeBuildingBlock: paginationAttribute
  } = data

  return (
    <div className='flex flex-col gap-y-4' ref={headerRef}>
      <div className='flex flex-col gap-y-2'>
        <div className='text-xl font-semibold text-dial-ochre'>
          {format('ui.buildingBlock.header')}
        </div>
        <div className='text-xs italic'>
          {format('ui.wizard.buildingBlock.description')}
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {buildingBlocks.map((buildingBlock, index) =>
          <BuildingBlockCard
            key={index}
            index={index}
            buildingBlock={buildingBlock}
            displayType={DisplayType.SMALL_CARD}
          />
        )}
      </div>
      <Pagination
        pageNumber={pageNumber}
        totalCount={paginationAttribute.totalCount}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        onClickHandler={handlePageClick}
      />
    </div>
  )
}

export default BuildingBlockList
