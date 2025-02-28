import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import DatasetCard from '../../dataset/DatasetCard'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import Pagination from '../../shared/Pagination'
import { WIZARD_DATASETS_QUERY } from '../../shared/query/wizard'
import { DisplayType } from '../../utils/constants'
import { WizardContext } from '../WizardContext'

const DatasetList = ({ headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const DEFAULT_PAGE_SIZE = 5
  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const handlePageClick = (event) => {
    setPageNumber(event.selected)
    setPageOffset(event.selected * DEFAULT_PAGE_SIZE)
  }

  const { sectors, sdgs, tags } = useContext(WizardContext)
  const { loading, error, data } = useQuery(WIZARD_DATASETS_QUERY, {
    variables: {
      sdgs: sdgs.map(sdg => sdg.value),
      sectors: sectors.map(sector => sector),
      tags: tags.map(tag => tag.label),
      limit: DEFAULT_PAGE_SIZE,
      offset: pageOffset
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.paginatedDatasets && data?.paginationAttributeDataset) {
    return handleMissingData()
  }

  const {
    paginatedDatasets: datasets,
    paginationAttributeDataset: paginationAttribute
  } = data

  return (
    <div className='flex flex-col gap-y-4' ref={headerRef}>
      <div className='flex flex-col gap-y-2'>
        <div className='text-xl font-semibold text-dial-meadow'>
          {format('ui.dataset.header')}
        </div>
        <div className='text-xs italic'>
          {format('ui.wizard.dataset.description')}
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {datasets.map((dataset, index) =>
          <DatasetCard
            key={index}
            index={index}
            dataset={dataset}
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

export default DatasetList
