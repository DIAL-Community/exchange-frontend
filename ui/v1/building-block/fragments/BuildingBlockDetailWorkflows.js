import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import { UPDATE_BUILDING_BLOCK_WORKFLOWS } from '../../shared/mutation/buildingBlock'
import WorkflowCard from '../../workflow/WorkflowCard'
import { DisplayType } from '../../utils/constants'
import Select from '../../shared/form/Select'
import { fetchSelectOptions } from '../../utils/search'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { WORKFLOW_SEARCH_QUERY } from '../../shared/query/workflow'

const BuildingBlockDetailWorkflows = ({ buildingBlock, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [workflows, setWorkflows] = useState(buildingBlock.workflows)
  const [isDirty, setIsDirty] = useState(false)

  const [updateBuildingBlockWorkflows, { loading, reset }] = useMutation(UPDATE_BUILDING_BLOCK_WORKFLOWS, {
    onError() {
      setIsDirty(false)
      setWorkflows(buildingBlock?.workflows)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.workflow.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateBuildingBlockWorkflows: response } = data
      if (response?.buildingBlock && response?.errors?.length === 0) {
        setIsDirty(false)
        setWorkflows(response?.buildingBlock?.workflows)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.workflow.header') }))
      } else {
        setIsDirty(false)
        setWorkflows(buildingBlock?.workflows)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.workflow.header') }))
        reset()
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const fetchedWorkflowsCallback = (data) => (
    data.workflows?.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      slug: workflow.slug,
      label: workflow.name
    }))
  )

  const addWorkflow = (workflow) => {
    setWorkflows([
      ...[
        ...workflows.filter(({ id }) => id !== workflow.id),
        { id: workflow.id, name: workflow.name, slug: workflow.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeWorkflow = (workflow) => {
    setWorkflows([...workflows.filter(({ id }) => id !== workflow.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateBuildingBlockWorkflows({
        variables: {
          workflowSlugs: workflows.map(({ slug }) => slug),
          slug: buildingBlock.slug
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
    setWorkflows(buildingBlock.workflows)
    setIsDirty(false)
  }

  const displayModeBody = workflows.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4'>
      {workflows?.map((workflow, index) =>
        <div key={`workflow-${index}`}>
          <WorkflowCard workflow={workflow} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.workflow.label'),
        base: format('ui.buildingBlock.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-ochre' ref={headerRef}>
      {format('ui.workflow.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.workflow.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, WORKFLOW_SEARCH_QUERY, fetchedWorkflowsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.workflow.label') })}
          onChange={addWorkflow}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {workflows.map((workflow, workflowIdx) => (
          <Pill
            key={`workflows-${workflowIdx}`}
            label={workflow.name}
            onRemove={() => removeWorkflow(workflow)}
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

export default BuildingBlockDetailWorkflows
