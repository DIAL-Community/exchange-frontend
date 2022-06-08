import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'
import { fetchSelectOptions } from '../../../queries/utils'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../queries/building-block'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const customStyles = (controlSize = '14rem') => {
  return {
    ...asyncSelectStyles,
    control: (provided) => ({
      ...provided,
      width: controlSize,
      boxShadow: 'none',
      cursor: 'pointer'
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer'
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 30 }),
    menu: (provided) => ({ ...provided, zIndex: 30 })
  }
}

export const BuildingBlockAutocomplete = (props) => {
  const client = useApolloClient()
  const { buildingBlocks, setBuildingBlocks, containerStyles, controlSize, placeholder } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  let controlPlaceholder = placeholder
  if (!controlPlaceholder) {
    controlPlaceholder = format('filter.byEntity', { entity: format('buildingBlock.label') })
  }

  const selectBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(b => b.value !== buildingBlock.value), buildingBlock])
  }

  const fetchedBuildingBlocksCallback = (data) => (
    data.buildingBlocks.map((buildingBlock) => ({
      label: buildingBlock.name,
      value: buildingBlock.id,
      slug: buildingBlock.slug
    }))
  )

  return (
    <div className={`${containerStyles} catalog-filter text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', { entity: format('buildingBlock.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, BUILDING_BLOCK_SEARCH_QUERY, fetchedBuildingBlocksCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('building-block.header') })}
        onChange={selectBuildingBlock}
        placeholder={controlPlaceholder}
        styles={customStyles(controlSize)}
        value=''
      />
    </div>
  )
}

export const BuildingBlockFilters = (props) => {
  const { buildingBlocks, setBuildingBlocks } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeBuildingBlock = (buildingBlockId) => {
    setBuildingBlocks(buildingBlocks.filter(buildingBlock => buildingBlock.value !== buildingBlockId))
  }

  return (
    <>
      {
        buildingBlocks &&
          buildingBlocks.map(buildingBlock => (
            <div key={`filter-${buildingBlock.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('buildingBlock.label')}: ${buildingBlock.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeBuildingBlock(buildingBlock.value)} />
            </div>
          ))
      }
    </>
  )
}
