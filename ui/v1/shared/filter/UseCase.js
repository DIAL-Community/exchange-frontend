import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { BsPlus } from 'react-icons/bs'
import { useApolloClient } from '@apollo/client'
import Select from '../form/Select'
import { fetchSelectOptionsWithMaturity } from '../../utils/search'
import { USE_CASE_SEARCH_QUERY } from '../query/useCase'

export const UseCaseAutocomplete = ({ useCases, setUseCases, placeholder }) => {
  const client = useApolloClient()

  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.useCase.label') })

  const selectUseCase = (useCase) => {
    setUseCases([...useCases.filter(s => s.value !== useCase.value), useCase])
  }

  const fetchCallback = (data) => (
    data?.useCases.map((useCase) => ({
      label: useCase.name,
      value: useCase.id,
      slug: useCase.slug
    }))
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <button type='button' className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.useCase.label')}
        </div>
        <BsPlus className='ml-auto text-dial-stratos my-auto' />
      </button>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.useCase.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptionsWithMaturity(client, input, USE_CASE_SEARCH_QUERY, fetchCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.useCase.label') })}
          onChange={selectUseCase}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const UseCaseActiveFilters = ({ useCases, setUseCases }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeUseCase = (useCaseSlug) => {
    setUseCases(useCases => [...useCases.filter(useCase => useCase.slug !== useCaseSlug)])
  }

  return (
    <>
      {useCases?.map((useCase, useCaseIndex) => (
        <div key={useCaseIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {useCase.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.useCase.label')})
              </div>
            </div>
            <button onClick={() => removeUseCase(useCase.slug)}>
              <IoClose size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
