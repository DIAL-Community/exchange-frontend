import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

import { UseCaseLogo } from '../../logo'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const USE_CASE_SEARCH_QUERY = gql`
  query UseCases($search: String!, $mature: Boolean!) {
    useCases(search: $search, mature: $mature) {
      id
      name
      slug
    }
  }
`

const customStyles = {
  ...asyncSelectStyles,
  control: (provided) => ({
    ...provided,
    width: '11rem',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  }),
  menuPortal: (provided) => ({ ...provided, zIndex: 30 }),
  menu: (provided) => ({ ...provided, zIndex: 30 })
}

export const UseCaseAutocomplete = (props) => {
  const client = useApolloClient()
  const { useCases, setUseCases, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectUseCase = (useCase) => {
    setUseCases([...useCases.filter(u => u.value !== useCase.value), useCase])
  }

  const fetchOptions = async (input, callback, query) => {
    if (input && input.trim().length < 2) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input,
        mature: true
      }
    })

    if (response.data && response.data.useCases) {
      return response.data.useCases.map((useCase) => ({
        label: useCase.name,
        value: useCase.id,
        slug: useCase.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <div className='flex flex-row'>
          <UseCaseLogo fill='white' className='ml-2' />
          <div className='text-sm px-2 text-dial-gray-light my-auto'>
            {format('useCase.header')}
          </div>
        </div>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, USE_CASE_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('useCase.header') })}
          onChange={selectUseCase}
          placeholder={format('filter.byEntity', { entity: format('useCase.label') })}
          styles={customStyles}
          value=''
        />
      </label>
    </div>
  )
}

export const UseCaseFilters = (props) => {
  const { useCases, setUseCases } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeUseCase = (useCaseId) => {
    setUseCases(useCases.filter(useCase => useCase.value !== useCaseId))
  }

  return (
    <>
      {
        useCases &&
          useCases.map(useCase => (
            <div key={`filter-${useCase.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('useCase.label')}: ${useCase.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeUseCase(useCase.value)} />
            </div>
          ))
      }
    </>
  )
}
