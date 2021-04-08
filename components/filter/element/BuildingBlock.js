import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const BUILDING_BLOCK_SEARCH_QUERY = gql`
  query SearchBuildingBlocks($search: String!) {
    searchBuildingBlocks(search: $search) {
      name
      slug
    }
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '14rem'
  })
}

export const BuildingBlockAutocomplete = (props) => {
  const client = useApolloClient()
  const [buildingBlock, setBuildingBlock] = useState('')
  const { buildingBlocks, setBuildingBlocks, containerStyles } = props

  const selectBuildingBlock = (buildingBlock) => {
    setBuildingBlock('')
    setBuildingBlocks([...buildingBlocks.filter(b => b.value !== buildingBlock.value), buildingBlock])
  }

  const fetchOptions = async (input, callback, query) => {
    if (input && input.trim().length < 2) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input
      }
    })

    if (response.data && response.data.searchBuildingBlocks) {
      return response.data.searchBuildingBlocks.map((buildingBlock) => ({
        label: buildingBlock.name,
        value: buildingBlock.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>Building Blocks</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, BUILDING_BLOCK_SEARCH_QUERY)}
          noOptionsMessage={() => 'Search for building blocks.'}
          onChange={selectBuildingBlock}
          placeholder='Filter by Building Block'
          styles={customStyles}
          value={buildingBlock}
        />
      </label>
    </div>
  )
}

export const BuildingBlockFilters = (props) => {
  const { buildingBlocks, setBuildingBlocks } = props
  const removeBuildingBlock = (buildingBlockId) => {
    setBuildingBlocks(buildingBlocks.filter(buildingBlock => buildingBlock.value !== buildingBlockId))
  }

  return (
    <>
      {
        buildingBlocks &&
          buildingBlocks.map(buildingBlock => (
            <div key={`filter-${buildingBlock.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`Building Block: ${buildingBlock.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeBuildingBlock(buildingBlock.value)} />
            </div>
          ))
      }
    </>
  )
}
