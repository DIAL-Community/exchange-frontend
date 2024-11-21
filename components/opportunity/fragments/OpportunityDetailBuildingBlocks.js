import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import BuildingBlockCard from '../../building-block/BuildingBlockCard'
import EditableSection from '../../shared/EditableSection'
import { generateMappingStatusOptions } from '../../shared/form/options'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { UPDATE_OPPORTUNITY_BUILDING_BLOCKS } from '../../shared/mutation/opportunity'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../shared/query/buildingBlock'
import { DisplayType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const OpportunityDetailBuildingBlocks = ({ opportunity, editingAllowed, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [buildingBlocks, setBuildingBlocks] = useState(opportunity.buildingBlocks)
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
      mappingStatus === (opportunity?.buildingBlocksMappingStatus)
    ) ?? mappingStatusOptions?.[0]
  )

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOpportunityBuildingBlocks, { loading, reset }] = useMutation(UPDATE_OPPORTUNITY_BUILDING_BLOCKS, {
    onError() {
      setIsDirty(false)
      setBuildingBlocks(opportunity?.buildingBlocks)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.buildingBlock.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateOpportunityBuildingBlocks: response } = data
      if (response?.opportunity && response?.errors?.length === 0) {
        setIsDirty(false)
        setBuildingBlocks(response?.opportunity?.buildingBlocks)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.buildingBlock.header') }))
      } else {
        setIsDirty(false)
        setBuildingBlocks(opportunity?.buildingBlocks)
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
    updateOpportunityBuildingBlocks({
      variables: {
        slug: opportunity.slug,
        mappingStatus: mappingStatus.value,
        buildingBlockSlugs: buildingBlocks.map(({ slug }) => slug)
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const onCancel = () => {
    setBuildingBlocks(opportunity.buildingBlocks)
    setIsDirty(false)
  }

  const displayModeBody = buildingBlocks.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
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
        base: format('ui.opportunity.label')
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
      editingAllowed={editingAllowed}
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

export default OpportunityDetailBuildingBlocks
