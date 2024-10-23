import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Checkbox from '../../shared/form/Checkbox'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../shared/query/buildingBlock'

export const BuildingBlockMultiSelect = ({ buildingBlocks, setBuildingBlocks }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, error, loading } = useQuery(BUILDING_BLOCK_SEARCH_QUERY, {
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
  } else if (!data?.buildingBlocks) {
    return handleMissingData()
  }

  const toggleBuildingBlock = (id) => {
    if (buildingBlocks.indexOf(id) >= 0) {
      setBuildingBlocks(buildingBlocks => [...buildingBlocks.filter(buildingBlock => buildingBlock !== id)])
    } else {
      setBuildingBlocks(buildingBlocks => [...buildingBlocks, id])
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-3 pb-12'>
      {data?.buildingBlocks &&
        data?.buildingBlocks.map((buildingBlock, index) => (
          <div key={index} className='flex gap-2 w-full'>
            <Checkbox
              id={`building-block-${index}`}
              ariaDescribedBy={`building-block-${index}-text`}
              className='focus:ring-0'
              onChange={() => toggleBuildingBlock(buildingBlock.id)}
              value={buildingBlocks.indexOf(buildingBlock.id) >= 0}
            />
            <div className='text-sm'>
              <label htmlFor={`building-block-${index}`} className='font-medium text-dial-stratos'>
                {buildingBlock.name}
              </label>
              <div id={`building-block-${index}-text`} className='text-xs font-normal text-dial-stratos'>
                {format(`wizard.bb.${buildingBlock.name.replace(/\s+/g, '').toLowerCase()}`)}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
