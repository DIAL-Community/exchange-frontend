import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import { PRODUCT_SEARCH_QUERY } from '../../queries/product'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { fetchSelectOptions } from '../../queries/utils'
import ProductCard from '../products/ProductCard'
import { UPDATE_BUILDING_BLOCK_PRODUCTS } from '../../mutations/building-block'
import { getMappingStatusOptions } from '../../lib/utilities'
import { useUser } from '../../lib/hooks'

const BuildingBlockDetailProducts = ({ buildingBlock, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const [products, setProducts] = useState(buildingBlock.products)

  const mappingStatusOptions =
    getMappingStatusOptions(format)
      .filter(
        (status) =>
          status.label === `${format('shared.mappingStatus.beta')}` ||
          status.label === `${format('shared.mappingStatus.validated')}`
      )

  const [mappingStatus, setMappingStatus] = useState(
    mappingStatusOptions.find(({ value: mappingStatus }) =>
      mappingStatus === (buildingBlock?.products.buildingBlocksMappingStatus)
    ) ?? mappingStatusOptions?.[0]
  )

  const [isDirty, setIsDirty] = useState(false)

  const [updateBuildingBlockProducts, { data, loading, reset }] = useMutation(UPDATE_BUILDING_BLOCK_PRODUCTS, {
    onCompleted: (data) => {
      const { updateBuildingBlockProducts: response } = data
      if (response?.buildingBlock && response?.errors?.length === 0) {
        setIsDirty(false)
        setProducts(response?.buildingBlock.products)
        showToast(format('toast.products.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setProducts(buildingBlock.products)
        showToast(format('toast.products.update.failure'), 'error', 'top-center')
        reset()
      }
    },
    onError: () => {
      setIsDirty(false)
      setProducts(buildingBlock.products)
      showToast(format('toast.products.update.failure'), 'error', 'top-center')
      reset()
    }
  })

  const fetchedProductsCallback = (data) => (
    data.products?.map((product) => ({
      label: product.name,
      slug: product.slug
    }))
  )

  const addProduct = (product) => {
    setProducts([...products.filter(({ slug }) => slug !== product.slug), { name: product.label, slug: product.slug }])
    setIsDirty(true)
  }

  const removeProduct = (product) => {
    setProducts([...products.filter(({ slug }) => slug !== product.slug)])
    setIsDirty(true)
  }

  const updateMappingStatus = (selectedMappingStatus) => {
    setMappingStatus(selectedMappingStatus)
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateBuildingBlockProducts({
        variables: {
          slug: buildingBlock.slug,
          mappingStatus: mappingStatus.value,
          productSlugs: products.map(({ slug }) => slug)
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
    setProducts(data?.updateBuildingBlockProducts?.buildingBlock?.products ?? buildingBlock.products)
    setMappingStatus(mappingStatusOptions.find(({ value: mappingStatus }) =>
      mappingStatus === (
        data?.updateBuildingBlockProducts?.buildingBlock?.products.buildingBlocksMappingStatus ??
        buildingBlock.products.buildingBlocksMappingStatus
      )
    ))
    setIsDirty(false)
  }

  const displayModeBody = products.length
    ? (
      <div className='grid grid-cols-1'>
        {products.map((product, productIdx) => <ProductCard key={productIdx} product={product} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('building-block.no-product')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('ui.product.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2'>
        {format('app.mappingStatus')}
        <Select
          options={mappingStatusOptions}
          placeholder={format('app.mappingStatus')}
          onChange={updateMappingStatus}
          value={mappingStatus}
        />
      </label>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='product-search'>
        {`${format('app.searchAndAssign')} ${format('ui.product.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, PRODUCT_SEARCH_QUERY, fetchedProductsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.product.header') })}
          onChange={addProduct}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {products.map((product, productIdx) =>(
          <Pill
            key={`product-${productIdx}`}
            label={product.name}
            onRemove={() => removeProduct(product)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('ui.product.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default BuildingBlockDetailProducts
