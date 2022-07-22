
import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { WORKFLOW_SEARCH_QUERY } from '../../../queries/workflow'
import Select from '../../shared/Select'
import { fetchSelectOptions } from '../../../queries/utils'
import Pill from '../../shared/Pill'

export const WorkflowAutocomplete = ({
  workflows,
  setWorkflows,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('workflow.label') })

  const selectWorkflow = (workflow) => {
    setWorkflows([...workflows.filter(({ slug }) => slug !== workflow.slug), workflow])
  }

  const fetchedWorkflowsCallback = (data) => (
    data?.workflows.map((workflow) => ({
      label: workflow.name,
      value: workflow.id,
      slug: workflow.slug
    }))
  )

  return (
    <div className={classNames(containerStyles)} data-testid='workflow-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('workflow.label') })}
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, WORKFLOW_SEARCH_QUERY, fetchedWorkflowsCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('workflow.header') })}
        onChange={selectWorkflow}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const WorkflowFilters = (props) => {
  const { workflows, setWorkflows } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeWorkflow = (workflowId) => {
    setWorkflows(workflows.filter(({ slug }) => slug !== workflowId))
  }

  return (
    <>
      {workflows?.map((workflow, workflowIdx) => (
        <div className='py-1' key={workflowIdx}>
          <Pill
            key={`filter-${workflowIdx}`}
            label={`${format('workflow.label')}: ${workflow.label}`}
            onRemove={() => removeWorkflow(workflow.slug)}
          />
        </div>
      ))}
    </>
  )
}
