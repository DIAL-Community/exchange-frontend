import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_WORKFLOW_BUILDING_BLOCKS } from '../../mutations/workflow'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../queries/building-block'
import { fetchSelectOptions } from '../../queries/utils'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import EditableSection from '../shared/EditableSection'
import Pill from '../shared/Pill'
import Select from '../shared/Select'

const WorkflowDetailBuildingBlocks = ({ workflow, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [buildingBlocks, setBuildingBlocks] = useState(workflow.buildingBlocks)

  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const [updateWorkflowBuildingBlocks, { data, loading }] = useMutation(
    UPDATE_WORKFLOW_BUILDING_BLOCKS, {
      onCompleted: (data) => {
        const { updateWorkflowBuildingBlocks: response } = data
        if (response?.workflow && response?.errors?.length === 0) {
          setIsDirty(false)
          setBuildingBlocks(response?.workflow?.buildingBlocks)
          showToast(format('toast.buildingBlocks.update.success'), 'success', 'top-center')
        } else {
          setIsDirty(false)
          setBuildingBlocks(workflow.buildingBlocks)
          showToast(format('toast.buildingBlocks.update.failure'), 'error', 'top-center')
        }
      },
      onError: () => {
        setIsDirty(false)
        setBuildingBlocks(workflow.buildingBlocks)
        showToast(format('toast.buildingBlocks.update.failure'), 'error', 'top-center')
      }
    }
  )

  const fetchedBuildingBlocksCallback = (data) => (
    data.buildingBlocks.map((buildingBlock) => ({
      label: buildingBlock.name,
      slug: buildingBlock.slug
    }))
  )

  const addBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([
      ...buildingBlocks.filter(({ slug }) => slug !== buildingBlock.slug),
      { name: buildingBlock.label, slug: buildingBlock.slug }
    ])
    setIsDirty(true)
  }

  const removeBuildingBlock = (buildingBlock) => {
    setBuildingBlocks([...buildingBlocks.filter(({ slug }) => slug !== buildingBlock.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateWorkflowBuildingBlocks({
        variables: {
          slug: workflow.slug,
          buildingBlocksSlugs: buildingBlocks.map(({ slug }) => slug)
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
    setBuildingBlocks(
      data?.updateWorkflowBuildingBlocks?.workflow?.buildingBlocks ??
      workflow.buildingBlocks
    )
    setIsDirty(false)
  }

  const displayModeBody =
    <>
      {buildingBlocks.length ? (
        <div className='grid grid-cols-1'>
          {buildingBlocks.map((buildingBlock, buildingBlockIdx) =>
            <BuildingBlockCard key={buildingBlockIdx} buildingBlock={buildingBlock} listType='list' />
          )}
        </div>
      ) : (
        <div className='text-sm pb-5 text-button-gray'>
          {format('workflow.no-building-block')}
        </div>
      )}
    </>

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('building-block.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='building-block-search'>
        {`${format('app.searchAndAssign')} ${format('building-block.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={
            (input) => fetchSelectOptions(
              client,
              input,
              BUILDING_BLOCK_SEARCH_QUERY,
              fetchedBuildingBlocksCallback
            )
          }
          noOptionsMessage={
            () => format(
              'filter.searchFor',
              { entity: format('building-block.header') }
            )
          }
          onChange={addBuildingBlock}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {buildingBlocks.map((buildingBlock, buildingBlockIdx) => (
          <Pill
            key={`buildingBlock-${buildingBlockIdx}`}
            label={buildingBlock.name}
            onRemove={() => removeBuildingBlock(buildingBlock)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('building-block.header')}
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
