import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const WORKFLOW_SEARCH_QUERY = gql`
  query SearchWorkflows($search: String!) {
    searchWorkflows(search: $search) {
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

export const WorkflowAutocomplete = (props) => {
  const client = useApolloClient()
  const [workflow, setWorkflow] = useState('')
  const { workflows, setWorkflows, containerStyles } = props

  const selectWorkflow = (workflow) => {
    setWorkflow('')
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

    if (response.data && response.data.searchWorkflows) {
      return response.data.searchWorkflows.map((workflow) => ({
        label: workflow.name,
        value: workflow.slug
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>Workflows</span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, WORKFLOW_SEARCH_QUERY)}
          noOptionsMessage={() => 'Search for workflows.'}
          onChange={selectWorkflow}
          placeholder='Filter by Workflow'
          styles={customStyles}
          value={workflow}
        />
      </label>
    </div>
  )
}

export const WorkflowFilters = (props) => {
  const { workflows, setWorkflows } = props
  const removeWorkflow = (workflowId) => {
    setWorkflows(workflows.filter(workflow => workflow.value !== workflowId))
  }

  return (
    <>
      {
        workflows &&
          workflows.map(workflow => (
            <div key={`filter-${workflow.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`Workflow: ${workflow.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeWorkflow(workflow.value)} />
            </div>
          ))
      }
    </>
  )
}