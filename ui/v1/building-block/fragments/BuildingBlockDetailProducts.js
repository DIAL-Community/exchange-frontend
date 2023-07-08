import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import Select from '../../shared/form/Select'
import { PRODUCT_SEARCH_QUERY } from '../../../../queries/product'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import { fetchSelectOptions } from '../../utils/search'
import { DisplayType } from '../../utils/constants'
import { UPDATE_BUILDING_BLOCK_PRODUCTS } from '../../shared/mutation/buildingBlock'
import ProductCard from '../../product/ProductCard'

const BuildingBlockDetailProducts = ({ buildingBlock, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [products, setProducts] = useState(buildingBlock.products)
  const [isDirty, setIsDirty] = useState(false)

  const [updateBuildingBlockProducts, { loading, reset }] = useMutation(UPDATE_BUILDING_BLOCK_PRODUCTS, {
    onError() {
      setIsDirty(false)
      setProducts(buildingBlock?.products)
      showToast(format('toast.products.update.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { updateBuildingBlockProducts: response } = data
      if (response?.buildingBlock && response?.errors?.length === 0) {
        setIsDirty(false)
        setProducts(response?.buildingBlock?.products)
        showToast(format('toast.products.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setProducts(buildingBlock?.products)
        showToast(format('toast.products.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedProductsCallback = (data) => (
    data.products?.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      label: product.name
    }))
  )

  const addProducts = (product) => {
    setProducts([
      ...[
        ...products.filter(({ id }) => id !== product.id),
        { id: product.id, name: product.name, slug: product.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeProducts = (product) => {
    setProducts([...products.filter(({ id }) => id !== product.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateBuildingBlockProducts({
        variables: {
          productSlugs: products.map(({ slug }) => slug),
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
    setProducts(buildingBlock.products)
    setIsDirty(false)
  }

  const displayModeBody = products.length
    ? <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
      {products?.map((product, index) =>
        <div key={`product-${index}`}>
          <ProductCard product={product} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format('ui.common.detail.noData', { entity: format('ui.product.label') })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-blueberry' ref={headerRef}>
      {format('ui.product.header')}
    </div>

  const editModeBody =
    <div className='px-8 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.product.label')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, PRODUCT_SEARCH_QUERY, fetchedProductsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.product.label') })}
          onChange={addProducts}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {products.map((product, productIdx) => (
          <Pill
            key={`products-${productIdx}`}
            label={product.name}
            onRemove={() => removeProducts(product)}
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

export default BuildingBlockDetailProducts
