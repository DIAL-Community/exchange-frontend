import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { BsPlus } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { fetchSelectOptions } from '../../utils/search'
import { OPERATOR_SEARCH_QUERY } from '../../shared/query/operator'
import Select from '../form/Select'
import { compareAlphabetically } from './utilities'

export const OperatorAutocomplete = ({
  operators,
  setOperators,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()
  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.operator.label') })

  const selectOperator = (operator) => {
    setOperators([...operators.filter(({ value }) => value !== operator.value), operator])
  }

  const fetchedOperatorsCallback = (data) => (

    data?.operatorServiceOnly
      .map((operator) => ({
        label: `${operator.name}`,
        value: `${operator.name}`
      }))
      .sort(compareAlphabetically)
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <button type='button' className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm py-2'>
          {format('ui.operator.label')}
        </div>
        <BsPlus className='ml-auto text-dial-stratos my-auto' />
      </button>
      {showFilter &&
        <Select
          async
          aria-label={format('filter.byEntity', { entity: format('ui.operator.label') })}
          className='rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, OPERATOR_SEARCH_QUERY, fetchedOperatorsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.operator.header') })}
          onChange={selectOperator}
          placeholder={controlPlaceholder}
          value=''
          isSearch={isSearch}
        />
      }
    </div>
  )
}

export const OperatorActiveFilters = (props) => {
  const { operators, setOperators } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeOperator = (operatorValue) => {
    setOperators(operators.filter(({ value }) => value !== operatorValue))
  }

  return (
    <>
      {operators?.map((operator, operatorIdx) => (
        <div key={operatorIdx} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {operator.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.operator.label')})
              </div>
            </div>
            <button onClick={() => removeOperator(operator.value)}>
              <IoClose size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
