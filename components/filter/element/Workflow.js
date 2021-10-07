import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'

import { WorkflowLogo } from '../../logo'

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

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '11rem',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  })
}

export const WorkflowAutocomplete = (props) => {
  const client = useApolloClient()
  const { workflows, setWorkflows, containerStyles } = props

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
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <div className='flex flex-row'>
          <WorkflowLogo fill='white' className='ml-2' />
          <div className='text-sm px-2 text-dial-gray-light my-auto'>
            {format('workflow.header')}
          </div>
        </div>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, WORKFLOW_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('workflow.header') })}
          onChange={selectWorkflow}
          placeholder={format('filter.byEntity', { entity: format('workflow.label') })}
          styles={customStyles}
          value=''
        />
      </label>
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
            <div key={`filter-${workflow.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('workflow.label')}: ${workflow.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeWorkflow(workflow.value)} />
            </div>
          ))
      }
    </>
  )
}
