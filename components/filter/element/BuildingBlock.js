import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import classNames from 'classnames'
import { fetchSelectOptions } from '../../../queries/utils'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../queries/building-block'
import Select from '../../shared/Select'
import Pill from '../../shared/Pill'

export const BuildingBlockAutocomplete = ({
  buildingBlocks,
  setBuildingBlocks,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('buildingBlock.label') })

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
    <div className={classNames(containerStyles)} data-testid='building-block-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('buildingBlock.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) =>
          fetchSelectOptions(client, input, BUILDING_BLOCK_SEARCH_QUERY, fetchedBuildingBlocksCallback)
        }
        noOptionsMessage={() => format('filter.searchFor', { entity: format('building-block.header') })}
        onChange={selectBuildingBlock}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const BuildingBlockFilters = (props) => {
  const { buildingBlocks, setBuildingBlocks } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeBuildingBlock = (buildingBlockId) => {
    setBuildingBlocks(buildingBlocks.filter(({ slug }) => slug !== buildingBlockId))
  }

  return (
    <>
      {buildingBlocks?.map((buildingBlock, buildingBlockIdx) => (
        <div className='py-1' key={buildingBlockIdx}>
          <Pill
            key={`filter-${buildingBlockIdx}`}
            label={`${format('buildingBlock.label')}: ${buildingBlock.label}`}
            onRemove={() => removeBuildingBlock(buildingBlock.slug)}
          />
        </div>
      ))}
    </>
  )
}
