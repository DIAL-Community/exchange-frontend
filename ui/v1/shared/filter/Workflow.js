import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { BsPlus } from 'react-icons/bs'
import { useApolloClient } from '@apollo/client'
import Select from '../form/Select'
import { fetchSelectOptions } from '../../utils/search'
import { WORKFLOW_SEARCH_QUERY } from '../query/workflow'

export const WorkflowAutocomplete = ({ workflows, setWorkflows, placeholder }) => {
  const client = useApolloClient()

  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.workflow.label') })

  const selectWorkflow = (workflow) => {
    setWorkflows([...workflows.filter(s => s.value !== workflow.value), workflow])
  }

  const fetchCallback = (data) => (
    data?.workflows.map((workflow) => ({
      label: workflow.name,
      value: workflow.id,
      slug: workflow.slug
    }))
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <button className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm ml-4 py-2'>
          {format('ui.workflow.label')}
        </div>
        <BsPlus className='ml-auto' />
      </button>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.workflow.label') })}
          className='ml-4 rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, WORKFLOW_SEARCH_QUERY, fetchCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.workflow.label') })}
          onChange={selectWorkflow}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const WorkflowActiveFilters = ({ workflows, setWorkflows }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeWorkflow = (workflowSlug) => {
    setWorkflows(workflows => [...workflows.filter(workflow => workflow.slug !== workflowSlug)])
  }

  return (
    <>
      {workflows?.map((workflow, workflowIndex) => (
        <div key={workflowIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {workflow.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.workflow.label')})
              </div>
            </div>
            <button onClick={() => removeWorkflow(workflow.slug)}>
              <IoClose size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}