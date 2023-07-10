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
import { UPDATE_PRODUCT_BUILDING_BLOCKS } from '../../shared/mutation/product'
import { generateMappingStatusOptions } from '../../shared/form/options'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../shared/query/buildingBlock'
import BuildingBlockCard from '../../building-block/BuildingBlockCard'

const ProductDetailBuildingBlocks = ({ product, canEdit, headerRef }) => {
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
      mappingStatus === (product?.buildingBlocks.productsMappingStatus)
    ) ?? mappingStatusOptions?.[0]
  )

  const [updateProductBuildingBlocks, { loading, reset }] = useMutation(UPDATE_PRODUCT_BUILDING_BLOCKS, {
    onError() {
      setIsDirty(false)
      setBuildingBlocks(product?.buildingBlocks)
      showToast(format('toast.buildingBlocks.update.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { updateProductBuildingBlocks: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setBuildingBlocks(response?.product?.buildingBlocks)
        showToast(format('toast.buildingBlocks.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setBuildingBlocks(product?.buildingBlocks)
        showToast(format('toast.buildingBlocks.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedBuildingBlocksCallback = (data) => (
    data.buildingBlocks?.map((buildingBlock) => ({
      id: buildingBlock.id,
      name: buildingBlock.name,
      slug: buildingBlock.slug,
      label: buildingBlock.name
    }))
  )

  const addBuildingBlocks = (buildingBlock) => {
    setBuildingBlocks([
      ...[
        ...buildingBlocks.filter(({ id }) => id !== buildingBlock.id),
        { id: buildingBlock.id, name: buildingBlock.name, slug: buildingBlock.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeBuildingBlocks = (buildingBlock) => {
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

      updateProductBuildingBlocks({
        variables: {
          slug: product.slug,
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
    setBuildingBlocks(product.buildingBlocks)
    setIsDirty(false)
  }

  const displayModeBody = buildingBlocks.length
    ? <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
      {buildingBlocks?.map((buildingBlock, index) =>
        <div key={`building-block-${index}`}>
          <BuildingBlockCard buildingBlock={buildingBlock} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.buildingBlock.label'),
        base: format('ui.product.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-ochre' ref={headerRef}>
      {format('ui.buildingBlock.header')}
    </div>

  const sectionDisclaimer =
    <div className='text-xs italic text-dial-stratos'>
      {format('ui.buildingBlock.disclaimer')}
    </div>

  const editModeBody =
    <div className='px-8 py-4 flex flex-col gap-y-3 text-sm'>
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
          onChange={addBuildingBlocks}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {buildingBlocks.map((buildingBlock, buildingBlockIdx) => (
          <Pill
            key={`buildingBlocks-${buildingBlockIdx}`}
            label={buildingBlock.name}
            onRemove={() => removeBuildingBlocks(buildingBlock)}
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

export default ProductDetailBuildingBlocks
