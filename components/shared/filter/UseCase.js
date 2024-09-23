import { useCallback, useState } from 'react'
import { BsDash, BsPlus } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'
import { fetchSelectOptionsWithMaturity } from '../../utils/search'
import Select from '../form/Select'
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
      name: useCase.name,
      slug: useCase.slug,
      label: useCase.name,
      value: useCase.id
    }))
  )

  const toggleFilter = (event) => {
    event.preventDefault()
    setShowFilter(!showFilter)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <a href='#' className='flex' onClick={toggleFilter}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.useCase.label')}
        </div>
        {showFilter
          ? <BsDash className='ml-auto text-dial-stratos my-auto' />
          : <BsPlus className='ml-auto text-dial-stratos my-auto' />
        }
      </a>
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
              <FaXmark size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
