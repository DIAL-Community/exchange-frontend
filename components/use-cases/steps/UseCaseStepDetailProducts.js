import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'
import { PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import EditableSection from '../../shared/EditableSection'
import { ToastContext } from '../../../lib/ToastContext'
import { fetchSelectOptions } from '../../../queries/utils'
import ProductCard from '../../products/ProductCard'
import { UPDATE_USE_CASE_STEP_PRODUCTS } from '../../../mutations/useCaseStep'

const UseCaseStepDetailProducts = ({ useCaseStep, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [products, setProducts] = useState(useCaseStep.products)

  const [isDirty, setIsDirty] = useState(false)

  const { data: session } = useSession()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const [updateUseCaseStepProducts, { data, loading }] = useMutation(UPDATE_USE_CASE_STEP_PRODUCTS, {
    onCompleted: (data) => {
      setProducts(data.updateUseCaseStepProducts.useCaseStep.products)
      setIsDirty(false)
      showToast(format('toast.products.update.success'), 'success', 'top-center')
    },
    onError: () => {
      setProducts(useCaseStep.products)
      setIsDirty(false)
      showToast(format('toast.products.update.failure'), 'error', 'top-center')
    }
  })

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
    if (session) {
      const { userEmail, userToken } = session.user

      updateUseCaseStepProducts({
        variables: {
          slug: useCaseStep.slug,
          productsSlugs: products.map(({ slug }) => slug)
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
    setProducts(data?.updateUseCaseStepProducts?.useCaseStep.products ?? useCaseStep.products)
    setIsDirty(false)
  }

  const displayModeBody = products.length
    ? (
      <div className='grid grid-cols-1'>
        {products.map((product, productIdx) => <ProductCard key={productIdx} product={product} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('use-case-step.no-product')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
        {format('app.assign')} {format('product.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='product-search'>
        {`${format('app.searchAndAssign')} ${format('product.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, PRODUCT_SEARCH_QUERY, fetchedProductsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('product.header') })}
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
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('product.header')}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default UseCaseStepDetailProducts
