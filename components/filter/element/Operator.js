import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const OPERATOR_SEARCH_QUERY = gql`
  query OperatorServiceOnly($search: String!) {
    operatorServiceOnly(search: $search) {
      name
    }
  }
`

const customStyles = {
  ...asyncSelectStyles,
  control: (provided) => ({
    ...provided,
    width: '18rem',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  }),
  menuPortal: (provided) => ({ ...provided, zIndex: 30 }),
  menu: (provided) => ({ ...provided, zIndex: 30 })
}

export const OperatorAutocomplete = (props) => {
  const client = useApolloClient()
  const { operators, setOperators, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectOperator = (operator) => {
    setOperators([...operators.filter(c => c.value !== operator.value), operator])
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

    if (response.data && response.data.operatorServiceOnly) {
      return response.data.operatorServiceOnly
        .map((operator) => ({
          label: `${operator.name}`,
          value: `${operator.name}`
        }))
        .sort((a, b) => {
          if (a.label < b.label) {
            return -1
          }

          if (b.label > a.label) {
            return 1
          }

          return 0
        })
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>{format('operator.header')}</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, OPERATOR_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('operator.header') })}
          onChange={selectOperator}
          placeholder={format('filter.byEntity', { entity: format('operator.label') })}
          styles={customStyles}
          value=''
        />
      </label>
    </div>
  )
}

export const OperatorFilters = (props) => {
  const { operators, setOperators } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeOperator = (operatorId) => {
    setOperators(operators.filter(operator => operator.value !== operatorId))
  }

  return (
    <>
      {
        operators &&
          operators.map(operator => (
            <div key={`filter-${operator.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('operator.label')}: ${operator.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeOperator(operator.value)} />
            </div>
          ))
      }
    </>
  )
}
