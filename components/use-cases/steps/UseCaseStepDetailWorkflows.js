import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'
import EditableSection from '../../shared/EditableSection'
import { ToastContext } from '../../../lib/ToastContext'
import { fetchSelectOptions } from '../../../queries/utils'
import { WORKFLOW_SEARCH_QUERY } from '../../../queries/workflow'
import WorkflowCard from '../../workflows/WorkflowCard'
import { UPDATE_USE_CASE_STEP_WORKFLOWS } from '../../../mutations/useCaseStep'
import { useUser } from '../../../lib/hooks'

const UseCaseStepDetailWorkflows = ({ useCaseStep, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [workflows, setWorkflows] = useState(useCaseStep.workflows)
  const [isDirty, setIsDirty] = useState(false)

  const [updateUseCaseStepWorkflows, { data, loading, reset }] = useMutation(UPDATE_USE_CASE_STEP_WORKFLOWS, {
    onCompleted: (data) => {
      const { updateUseCaseStepWorkflows: response } = data
      if (response?.useCaseStep && response?.errors?.length === 0) {
        setIsDirty(false)
        setWorkflows(response?.useCaseStep?.workflows)
        showToast(format('toast.workflows.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setWorkflows(useCaseStep.workflows)
        showToast(format('toast.workflows.update.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setIsDirty(false)
      setWorkflows(useCaseStep.workflows)
      showToast(format('toast.workflows.update.failure'), 'error', 'top-center')
      reset()
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

      updateUseCaseStepWorkflows({
        variables: {
          slug: useCaseStep.slug,
          workflowSlugs: workflows.map(({ slug }) => slug)
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
    setWorkflows(data?.updateUseCaseStepWorkflows?.useCaseStep?.workflows ?? useCaseStep.workflows)
    setIsDirty(false)
  }

  const displayModeBody = workflows.length
    ? (
      <div className='flex flex-col gap-2'>
        {workflows.map((workflow, workflowIdx) =>
          <WorkflowCard key={workflowIdx} workflow={workflow} listType='list' />)
        }
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('use-case-step.no-workflow')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
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

export default UseCaseStepDetailWorkflows
