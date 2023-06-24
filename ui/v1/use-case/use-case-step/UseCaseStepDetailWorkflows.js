import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import WorkflowCard from '../../workflow/WorkflowCard'
import { DisplayType } from '../../utils/constants'
import Select from '../../shared/form/Select'
import { fetchSelectOptions } from '../../utils/search'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_USE_CASE_STEP_WORKFLOWS } from '../../shared/mutation/useCaseStep'
import { SDG_TARGET_SEARCH_QUERY } from '../../shared/query/workflow'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'

const UseCaseStepDetailWorkflows = ({ useCaseStep, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [workflows, setWorkflows] = useState(useCaseStep.workflows)
  const [isDirty, setIsDirty] = useState(false)

  const [updateUseCaseStepWorkflows, { loading, reset }] = useMutation(UPDATE_USE_CASE_STEP_WORKFLOWS, {
    onError() {
      setIsDirty(false)
      setWorkflows(useCaseStep?.workflows)
      showToast(format('toast.workflows.update.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { updateUseCaseStepWorkflows: response } = data
      if (response?.useCaseStep && response?.errors?.length === 0) {
        setIsDirty(false)
        setWorkflows(response?.useCaseStep?.workflows)
        showToast(format('toast.workflows.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setWorkflows(useCaseStep?.workflows)
        showToast(format('toast.workflows.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedWorkflowsCallback = (data) => (
    data.workflows?.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      label: workflow.name
    }))
  )

  const addWorkflows = (workflow) => {
    setWorkflows([
      ...[
        ...workflows.filter(({ id }) => id !== workflow.id),
        { id: workflow.id, name: workflow.name }
      ]
    ])
    setIsDirty(true)
  }

  const removeWorkflows = (workflow) => {
    setWorkflows([...workflows.filter(({ id }) => id !== workflow.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateUseCaseStepWorkflows({
        variables: {
          workflowIds: workflows.map(({ id }) => parseInt(id)),
          slug: useCaseStep.slug
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
    setWorkflows(useCaseStep.workflows)
    setIsDirty(false)
  }

  const displayModeBody = workflows.length
    ? (workflows?.map((workflow, index) =>
      <div key={`workflow-${index}`}>
        <WorkflowCard workflow={workflow} displayType={DisplayType.SMALL_CARD} />
      </div>
    )) : (
      <div className='text-sm text-dial-stratos'>
        {format('ui.common.detail.noData', { entity: format('ui.workflow.label') })}
      </div>
    )

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-blueberry' ref={headerRef}>
      {format('ui.workflow.header')}
    </div>

  const editModeBody =
    <div className='px-8 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.workflow.label')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, SDG_TARGET_SEARCH_QUERY, fetchedWorkflowsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.workflow.label') })}
          onChange={addWorkflows}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {workflows.map((workflow, workflowIdx) => (
          <Pill
            key={`workflows-${workflowIdx}`}
            label={workflow.name}
            onRemove={() => removeWorkflows(workflow)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
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
