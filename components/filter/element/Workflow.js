import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import { asyncSelectStyles } from '../../../lib/utilities'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const WORKFLOW_SEARCH_QUERY = gql`
  query Workflows($search: String!) {
    workflows(search: $search) {
      id
      name
      slug
    }
  }
`

const customStyles = (controlSize = '11rem') => {
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

export const WorkflowAutocomplete = (props) => {
  const client = useApolloClient()
  const { workflows, setWorkflows, containerStyles, controlSize } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectWorkflow = (workflow) => {
    setWorkflows([...workflows.filter(w => w.value !== workflow.value), workflow])
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

    if (response.data && response.data.workflows) {
      return response.data.workflows.map((workflow) => ({
        label: workflow.name,
        value: workflow.id,
        slug: workflow.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} catalog-filter text-dial-gray-dark flex`}>
      <AsyncSelect
        aria-label={format('filter.byEntity', { entity: format('workflow.label') })}
        className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
        cacheOptions
        defaultOptions
        loadOptions={(input, callback) => fetchOptions(input, callback, WORKFLOW_SEARCH_QUERY)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('workflow.header') })}
        onChange={selectWorkflow}
        placeholder={format('filter.byEntity', { entity: format('workflow.label') })}
        styles={customStyles(controlSize)}
        value=''
      />
    </div>
  )
}

export const WorkflowFilters = (props) => {
  const { workflows, setWorkflows } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeWorkflow = (workflowId) => {
    setWorkflows(workflows.filter(workflow => workflow.value !== workflowId))
  }

  return (
    <>
      {
        workflows &&
          workflows.map(workflow => (
            <div key={`filter-${workflow.label}`} className='px-2 py-1 my-auto rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('workflow.label')}: ${workflow.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeWorkflow(workflow.value)} />
            </div>
          ))
      }
    </>
  )
}
