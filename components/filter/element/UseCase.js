import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const USE_CASE_SEARCH_QUERY = gql`
  query SearchUseCases($search: String!) {
    searchUseCases(search: $search) {
      name
      slug
    }
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '11rem'
  })
}

export const UseCaseAutocomplete = (props) => {
  const client = useApolloClient()
  const [useCase, setUseCase] = useState('')
  const { useCases, setUseCases, containerStyles } = props

  const selectUseCase = (useCase) => {
    setUseCase('')
    setUseCases([...useCases.filter(u => u.value !== useCase.value), useCase])
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

    if (response.data && response.data.searchUseCases) {
      return response.data.searchUseCases.map((useCase) => ({
        label: useCase.name,
        value: useCase.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>Use Cases</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, USE_CASE_SEARCH_QUERY)}
          noOptionsMessage={() => 'Search for use cases.'}
          onChange={selectUseCase}
          placeholder='Filter by Use Case'
          styles={customStyles}
          value={useCase}
        />
      </label>
    </div>
  )
}

export const UseCaseFilters = (props) => {
  const { useCases, setUseCases } = props
  const removeUseCase = (useCaseId) => {
    setUseCases(useCases.filter(useCase => useCase.value !== useCaseId))
  }

  return (
    <>
      {
        useCases &&
          useCases.map(useCase => (
            <div key={`filter-${useCase.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`Use Case: ${useCase.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeUseCase(useCase.value)} />
            </div>
          ))
      }
    </>
  )
}
