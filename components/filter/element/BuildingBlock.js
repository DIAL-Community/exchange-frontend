import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'

import { BuildingBlockLogo } from '../../logo'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const BUILDING_BLOCK_SEARCH_QUERY = gql`
  query BuildingBlocks($search: String!) {
    buildingBlocks(search: $search) {
      id
      name
    }
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '14rem',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  })
}

export const BuildingBlockAutocomplete = (props) => {
  const client = useApolloClient()

  const { buildingBlocks, setBuildingBlocks, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(b => b.value !== buildingBlock.value), buildingBlock])
  }

  const fetchOptions = async (input, _, query) => {
    if (input && input.trim().length < 2) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input
      }
    })

    if (response.data && response.data.buildingBlocks) {
      return response.data.buildingBlocks.map((buildingBlock) => ({
        label: buildingBlock.name,
        value: buildingBlock.id
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <div className='flex flex-row'>
          <BuildingBlockLogo fill='white' className='ml-2' />
          <div className='text-sm px-2 text-dial-gray-light my-auto'>
            {format('buildingBlock.label')}
          </div>
        </div>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, BUILDING_BLOCK_SEARCH_QUERY)}
          noOptionsMessage={() => 'Search for building blocks.'}
          onChange={selectBuildingBlock}
          placeholder={format('filter.byEntity', { entity: format('buildingBlock.label') })}
          styles={customStyles}
        />
      </label>
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
            <div key={`filter-${buildingBlock.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('buildingBlock.label')}: ${buildingBlock.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeBuildingBlock(buildingBlock.value)} />
            </div>
          ))
      }
    </>
  )
}
