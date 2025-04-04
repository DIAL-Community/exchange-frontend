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
import HidableSection from '../../shared/HidableSection'
import { UPDATE_PRODUCT_BUILDING_BLOCKS } from '../../shared/mutation/product'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../shared/query/buildingBlock'
import { DisplayType, ObjectType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const ProductDetailBuildingBlocks = ({ product, editingAllowed, editingSection, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [buildingBlocks, setBuildingBlocks] = useState(product.buildingBlocks)
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
      mappingStatus === (product?.buildingBlocksMappingStatus)
    ) ?? mappingStatusOptions?.[0]
  )

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductBuildingBlocks, { loading, reset }] = useMutation(UPDATE_PRODUCT_BUILDING_BLOCKS, {
    onError() {
      setIsDirty(false)
      setBuildingBlocks(product?.buildingBlocks)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.buildingBlock.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductBuildingBlocks: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setBuildingBlocks(response?.product?.buildingBlocks)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.buildingBlock.header') }))
      } else {
        setIsDirty(false)
        setBuildingBlocks(product?.buildingBlocks)
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
    updateProductBuildingBlocks({
      variables: {
        slug: product.slug,
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
    setBuildingBlocks(product.buildingBlocks)
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
        base: format('ui.product.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-meadow' ref={headerRef}>
      {format('ui.buildingBlock.header')}
    </div>

  const sectionDisclaimer =
    <div className='text-xs text-justify italic text-dial-stratos mb-2'>
      {format('ui.product.overview.buildingBlock')}
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

  const hidableSection = (
    <HidableSection
      objectKey='buildingBlocks'
      objectType={ObjectType.PRODUCT}
      disabled={!editingSection}
      displayed={editingAllowed}
    />
  )

  return (
    <EditableSection
      editingAllowed={editingAllowed}
      hidableSection={hidableSection}
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

export default ProductDetailBuildingBlocks
