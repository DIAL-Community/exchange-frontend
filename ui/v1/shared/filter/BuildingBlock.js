import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { BsPlus } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import { useCallback, useState } from 'react'
import { fetchSelectOptions } from '../../utils/search'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../query/buildingBlock'
import Select from '../form/Select'

export const BuildingBlockAutocomplete = ({
  buildingBlocks,
  setBuildingBlocks,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()
  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.buildingBlock.label') })

  const selectBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(({ slug }) => slug !== buildingBlock.slug), buildingBlock])
  }

  const fetchedBuildingBlocksCallback = (data) => (
    data.buildingBlocks.map((buildingBlock) => ({
      label: buildingBlock.name,
      value: buildingBlock.id,
      slug: buildingBlock.slug
    }))
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <button type='button' className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.buildingBlock.label')}
        </div>
        <BsPlus className='ml-auto text-dial-stratos my-auto' />
      </button>
      {showFilter &&
        <Select
          async
          aria-label={format('filter.byEntity', { entity: format('ui.buildingBlock.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(
            client,
            input,
            BUILDING_BLOCK_SEARCH_QUERY,
            fetchedBuildingBlocksCallback
          )}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.buildingBlock.header') })}
          onChange={selectBuildingBlock}
          placeholder={controlPlaceholder}
          value=''
          isSearch={isSearch}
        />
      }
    </div>
  )
}

export const BuildingBlockActiveFilters = (props) => {
  const { buildingBlocks, setBuildingBlocks } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeBuildingBlock = (buildingBlockId) => {
    setBuildingBlocks(buildingBlocks => [
      ...buildingBlocks.filter(buildingBlock => buildingBlock.value !== buildingBlockId)
    ])
  }

  return (
    <>
      {buildingBlocks?.map((buildingBlock, buildingBlockIndex) => (
        <div key={buildingBlockIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {buildingBlock.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.buildingBlock.label')})
              </div>
            </div>
            <button onClick={() => removeBuildingBlock(buildingBlock.value)}>
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
