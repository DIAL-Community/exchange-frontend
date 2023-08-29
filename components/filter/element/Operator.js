import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import classNames from 'classnames'
import Select from '../../shared/Select'
import { OPERATOR_SEARCH_QUERY } from '../../../queries/operator'
import Pill from '../../shared/Pill'
import { fetchSelectOptions } from '../../../queries/utils'
import { compareAlphabetically } from '../../shared/compareAlphabetically'

export const OperatorAutocomplete = ({
  operators,
  setOperators,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

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
    <div className={classNames(containerStyles)} data-testid='operator-search'>
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
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const OperatorFilters = (props) => {
  const { operators, setOperators } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeOperator = (operatorValue) => {
    setOperators(operators.filter(({ value }) => value !== operatorValue))
  }

  return (
    <>
      {operators?.map((operator, operatorIdx) => (
        <div className='py-1' key={operatorIdx}>
          <Pill
            key={`filter-${operatorIdx}`}
            label={`${format('ui.operator.label')}: ${operator.label}`}
            onRemove={() => removeOperator(operator.value)}
          />
        </div>
      ))}
    </>
  )
}
