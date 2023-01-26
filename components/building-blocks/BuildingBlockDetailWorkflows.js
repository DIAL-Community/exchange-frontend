import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { fetchSelectOptions } from '../../queries/utils'
import { WORKFLOW_SEARCH_QUERY } from '../../queries/workflow'
import WorkflowCard from '../workflows/WorkflowCard'
import { UPDATE_BUILDING_BLOCK_WORKFLOWS } from '../../mutations/building-block'
import { useUser } from '../../lib/hooks'

const BuildingBlockDetailWorkflows = ({ buildingBlock, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [workflows, setWorkflows] = useState(buildingBlock.workflows)

  const [isDirty, setIsDirty] = useState(false)

  const [updateBuildingBlockWorkflows, { data, loading }] = useMutation(UPDATE_BUILDING_BLOCK_WORKFLOWS, {
    onCompleted: (data) => {
      setWorkflows(data.updateBuildingBlockWorkflows.buildingBlock.workflows)
      setIsDirty(false)
      showToast(format('toast.workflows.update.success'), 'success', 'top-center')
    },
    onError: () => {
      setWorkflows(buildingBlock.workflows)
      setIsDirty(false)
      showToast(format('toast.workflows.update.failure'), 'error', 'top-center')
    }
  })

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedWorkflowsCallback = (data) => (
    data.workflows.map((workflow) => ({
      label: workflow.name,
      value: workflow.id,
      slug: workflow.slug
    }))
  )

  const addWorkflow = (workflow) => {
    setWorkflows([
      ...workflows.filter(({ slug }) => slug !== workflow.slug),
      { name: workflow.label, slug: workflow.slug }
    ])
    setIsDirty(true)
  }

  const removeWorkflow = (workflow) => {
    setWorkflows([...workflows.filter(({ slug }) => slug !== workflow.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateBuildingBlockWorkflows({
        variables: {
          slug: buildingBlock.slug,
          workflowsSlugs: workflows.map(({ slug }) => slug)
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    setWorkflows(data?.updateBuildingBlockWorkflows?.buildingBlock?.workflows ?? buildingBlock.workflows)
    setIsDirty(false)
  }

  const displayModeBody = workflows.length
    ? (
      <div className='flex flex-col gap-2'>
        {workflows.map((workflow, workflowIdx) => <WorkflowCard key={workflowIdx} workflow={workflow} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('building-block.no-workflow')}
      </div>
    )

  const editModeBody =
  <>
    <p className='card-title text-dial-blue mb-3'>
      {format('app.assign')} {format('workflow.header')}
    </p>
    <label className='flex flex-col gap-y-2 mb-2' data-testid='workflow-search'>
      {`${format('app.searchAndAssign')} ${format('workflow.header')}`}
      <Select
        async
        isSearch
        defaultOptions
        cacheOptions
        placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
        loadOptions={(input) => fetchSelectOptions(client, input, WORKFLOW_SEARCH_QUERY, fetchedWorkflowsCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('workflow.header') })}
        onChange={addWorkflow}
        value={null}
      />
    </label>
    <div className='flex flex-wrap gap-3 mt-5'>
      {workflows.map((workflow, workflowIdx) => (
        <Pill
          key={`workflow-${workflowIdx}`}
          label={workflow.name}
          onRemove={() => removeWorkflow(workflow)}
        />
      ))}
    </div>
  </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('workflow.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default BuildingBlockDetailWorkflows
