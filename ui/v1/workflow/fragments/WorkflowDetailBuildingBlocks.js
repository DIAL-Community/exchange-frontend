import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import Select from '../../shared/form/Select'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import { fetchSelectOptions } from '../../utils/search'
import { DisplayType } from '../../utils/constants'
import { UPDATE_WORKFLOW_BUILDING_BLOCKS } from '../../shared/mutation/workflow'
import { generateMappingStatusOptions } from '../../shared/form/options'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../shared/query/buildingBlock'
import BuildingBlockCard from '../../building-block/BuildingBlockCard'

const WorkflowDetailBuildingBlocks = ({ workflow, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [buildingBlocks, setBuildingBlocks] = useState(workflow.buildingBlocks)
  const [isDirty, setIsDirty] = useState(false)

  const mappingStatusOptions =
    generateMappingStatusOptions(format)
      .filter(
        (status) =>
          status.label === `${format('shared.mappingStatus.beta')}` ||
          status.label === `${format('shared.mappingStatus.validated')}`
      )

  const [mappingStatus, setMappingStatus] = useState(
    mappingStatusOptions.find(({ value: mappingStatus }) =>
      mappingStatus === (workflow?.buildingBlocksMappingStatus)
    ) ?? mappingStatusOptions?.[0]
  )

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateWorkflowBuildingBlocks, { loading, reset }] = useMutation(UPDATE_WORKFLOW_BUILDING_BLOCKS, {
    onError() {
      setIsDirty(false)
      setBuildingBlocks(workflow?.buildingBlocks)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.buildingBlock.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateWorkflowBuildingBlocks: response } = data
      if (response?.workflow && response?.errors?.length === 0) {
        setIsDirty(false)
        setBuildingBlocks(response?.workflow?.buildingBlocks)
        showSuccessMessage(format('toast.submit.failure', { entity: format('ui.buildingBlock.header') }))
      } else {
        setIsDirty(false)
        setBuildingBlocks(workflow?.buildingBlocks)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.buildingBlock.header') }))
        reset()
      }
    }
  })

  const fetchedBuildingBlocksCallback = (data) => (
    data.buildingBlocks?.map((buildingBlock) => ({
      id: buildingBlock.id,
      name: buildingBlock.name,
      slug: buildingBlock.slug,
      label: buildingBlock.name
    }))
  )

  const addBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([
      ...[
        ...buildingBlocks.filter(({ id }) => id !== buildingBlock.id),
        { id: buildingBlock.id, name: buildingBlock.name, slug: buildingBlock.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(({ id }) => id !== buildingBlock.id)])
    setIsDirty(true)
  }

  const updateMappingStatus = (selectedMappingStatus) => {
    setMappingStatus(selectedMappingStatus)
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateWorkflowBuildingBlocks({
        variables: {
          slug: workflow.slug,
          mappingStatus: mappingStatus.value,
          buildingBlockSlugs: buildingBlocks.map(({ slug }) => slug)
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
    setBuildingBlocks(workflow.buildingBlocks)
    setIsDirty(false)
  }

  const displayModeBody = buildingBlocks.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4'>
      {buildingBlocks?.map((buildingBlock, index) =>
        <BuildingBlockCard
          key={index}
          buildingBlock={buildingBlock}
          displayType={DisplayType.SMALL_CARD}
        />
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.buildingBlock.label'),
        base: format('ui.workflow.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
      {format('ui.buildingBlock.header')}
    </div>

  const sectionDisclaimer =
    <div className='text-sm italic text-dial-stratos mb-3'>
      {format('ui.buildingBlock.disclaimer')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2 mb-2'>
        {format('app.mappingStatus')}
        <Select
          isBorderless
          options={mappingStatusOptions}
          placeholder={format('app.mappingStatus')}
          onChange={updateMappingStatus}
          value={mappingStatus}
        />
      </label>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.buildingBlock.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, BUILDING_BLOCK_SEARCH_QUERY, fetchedBuildingBlocksCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.buildingBlock.label') })}
          onChange={addBuildingBlock}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {buildingBlocks.map((buildingBlock, buildingBlockIdx) => (
          <Pill
            key={`buildingBlocks-${buildingBlockIdx}`}
            label={buildingBlock.name}
            onRemove={() => removeBuildingBlock(buildingBlock)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
      sectionDisclaimer={sectionDisclaimer}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default WorkflowDetailBuildingBlocks
