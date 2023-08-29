import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import { PRODUCT_SEARCH_QUERY } from '../../queries/product'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_ORGANIZATION_PRODUCTS } from '../../mutations/organization'
import { fetchSelectOptions } from '../../queries/utils'
import ProductCard from '../products/ProductCard'
import { useUser } from '../../lib/hooks'

const OrganizationDetailProducts = ({ organization, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [products, setProducts] = useState(organization.products)

  const [isDirty, setIsDirty] = useState(false)

  const [updateOrganizationProducts, { data, loading }] = useMutation(UPDATE_ORGANIZATION_PRODUCTS)

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (data?.updateOrganizationProducts?.errors.length === 0 && data?.updateOrganizationProducts?.organization) {
      setProducts(data.updateOrganizationProducts.organization.products)
      setIsDirty(false)
      showToast(format('organization.products.updated'), 'success', 'top-center')
    }
  }, [data, showToast, format])

  const fetchedProductsCallback = (data) => (
    data.products?.map((product) => ({
      label: product.name,
      value: product.id,
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

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateOrganizationProducts({
        variables: {
          slug: organization.slug,
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
    setProducts(data?.updateOrganizationProducts?.organization?.products ?? organization.products)
    setIsDirty(false)
  }

  const displayModeBody = products.length > 0
    ? (
      <div className='grid grid-cols-1'>
        {products.map((product, productIdx) => <ProductCard key={productIdx} product={product} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('organization.no-product')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('ui.product.header')}
      </p>
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
        {products.map((product, productIdx) => (
          <Pill
            key={`product-${productIdx}`}
            label={product.name}
            onRemove={() => removeProduct(product)}
          />
        ))}
      </div>
    </>

  return (
    (organization.products.length > 0 || canEdit) && <EditableSection
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

export default OrganizationDetailProducts
