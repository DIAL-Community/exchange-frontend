import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import { useUser } from '../../../lib/hooks'
import Select from '../../shared/Select'
import Pill from '../../shared/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_ORGANIZATION_CERTIFICATIONS } from '../../../mutations/organization'
import { fetchSelectOptions } from '../../../queries/utils'
import { PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import ProductCard from '../../products/ProductCard'

const StorefrontDetailProducts = ({ organization, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [isDirty, setIsDirty] = useState(false)
  const [products, setProducts] = useState(organization.productCertifications ?? [])

  const [updateProducts, { reset, loading }] = useMutation(UPDATE_ORGANIZATION_CERTIFICATIONS, {
    onCompleted: (data) => {
      const { updateOrganizationCertifications: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        showToast(format('organization.submit.success'), 'success', 'top-center')
        setProducts(response?.organization.productCertifications)
        setIsDirty(false)
      } else {
        showToast(format('organization.submit.failure'), 'error', 'top-center')
        setProducts(organization.productCertifications ?? [])
        setIsDirty(false)
        reset()
      }
    },
    onError: () => {
      showToast(format('organization.submit.failure'), 'error', 'top-center')
      setProducts(organization.productCertifications ?? [])
      setIsDirty(false)
      reset()
    }
  })

  const { user } = useUser()
  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const addProduct = (product) => {
    setProducts([...products.filter(existing => existing.slug !== product.slug), product])
    setIsDirty(true)
  }

  const removeProduct = (product) => {
    setProducts([...products.filter(existing => existing.slug !== product.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProducts({
        variables: {
          slug: organization.slug,
          productSlugs: products.map(product => product.slug)
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
    setProducts(organization.productCertifications)
    setIsDirty(false)
  }

  const displayModeBody = products?.length > 0
    ? (
      products.map((product, productIdx) =>
        <ProductCard key={productIdx} product={product} listType='list' />
      )
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('storefront.no-certification')}
      </div>
    )

  const fetchedProductsCallback = (data) => (
    data.products.map((product) => ({
      label: product.name,
      value: product.id,
      name: product.name,
      slug: product.slug
    }))
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
        {products?.map((product, index) => (
          <Pill
            key={`product-${index}`}
            label={product.name}
            onRemove={() => removeProduct(product)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('certification.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default StorefrontDetailProducts
