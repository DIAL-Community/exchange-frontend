import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../shared/query/buildingBlock'
import { fetchSelectOptions } from '../../utils/search'

const SyncBuildingBlocks = ({ buildingBlocks, setBuildingBlocks }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const fetchBuildingBlocksCallback = (data) => (
    data.buildingBlocks?.map((buildingBlock) => ({
      id: buildingBlock.id,
      name: buildingBlock.name,
      slug: buildingBlock.slug,
      label: buildingBlock.name
    }))
  )

  const removeBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(({ id }) => id !== buildingBlock.id)])
  }

  const addBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([
      ...[
        ...buildingBlocks.filter(({ id }) => id !== buildingBlock.id),
        { id: buildingBlock.id, name: buildingBlock.name, slug: buildingBlock.slug }
      ]
    ])
  }

  return (

    <div className='flex flex-col'>
      <ul className="flex flex-wrap gap-x-4 -mb-px">
        <li className="me-2">
          <div href='#' className='inline-block py-3 border-b-2 border-dial-sunshine'>
            {format('ui.buildingBlock.header')}
          </div>
        </li>
      </ul>
      <div className='flex flex-col gap-y-3 border px-6 py-4'>
        <label className='flex flex-col gap-y-2'>
          {`${format('ui.syncTenant.searchFor')} ${format('ui.buildingBlock.label')}`}
          <Select
            async
            isSearch
            isBorderless
            defaultOptions
            cacheOptions
            placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
            loadOptions={(input) =>
              fetchSelectOptions(client, input, BUILDING_BLOCK_SEARCH_QUERY, fetchBuildingBlocksCallback)
            }
            noOptionsMessage={() => format('ui.syncTenant.searchFor', { entity: format('ui.buildingBlock.label') })}
            onChange={addBuildingBlock}
            value={null}
          />
        </label>
        <div className='flex flex-wrap gap-3'>
          {buildingBlocks.map((buildingBlock, buildingBlockIdx) => (
            <Pill
              key={`author-${buildingBlockIdx}`}
              label={buildingBlock.name}
              onRemove={() => removeBuildingBlock(buildingBlock)}
            />
          ))}
        </div>
      </div>
    </div>
  )

}

export default SyncBuildingBlocks
