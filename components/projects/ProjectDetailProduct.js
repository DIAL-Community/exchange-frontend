import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import { PRODUCT_SEARCH_QUERY } from '../../queries/product'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_PROJECT_PRODUCTS } from '../../mutations/project'
import { fetchSelectOptions } from '../../queries/utils'
import ProductCard from '../products/ProductCard'
import { useProductOwnerUser, useUser } from '../../lib/hooks'

const ProjectDetailProducts = ({ project, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const [products, setProducts] = useState(project.products)

  const { user, isAdminUser } = useUser()
  const { ownedProducts } = useProductOwnerUser(null, products, isAdminUser)

  const ownedProjectProducts = ownedProducts.filter(
    ({ slug: ownedProductSlug }) => products.some(({ slug }) => ownedProductSlug === slug)
  )

  const [isDirty, setIsDirty] = useState(false)

  const [updateProjectProducts, { data, loading, reset }] = useMutation(UPDATE_PROJECT_PRODUCTS, {
    onError() {
      setIsDirty(false)
      setProducts(project.products)
      showToast(format('toast.products.update.failure'), 'error', 'top-center')
      reset()
    },
    onCompleted: (data) => {
      const { updateProjectProducts: response } = data
      if (response?.project && response?.errors?.length === 0) {
        setIsDirty(false)
        setProducts(data.updateProjectProducts.project.products)
        showToast(format('toast.products.update.success'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setProducts(project.products)
        showToast(format('toast.products.update.failure'), 'error', 'top-center')
        reset()
      }
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
    if (user) {
      const { userEmail, userToken } = user

      updateProjectProducts({
        variables: {
          slug: project.slug,
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
    setProducts(data?.updateProjectProducts?.project?.products ?? project.products)
    setIsDirty(false)
  }

  const displayModeBody = products.length
    ? (
      <div className='grid grid-cols-1'>
        {products.map((product, productIdx) => <ProductCard key={productIdx} product={product} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('project.noProduct')}
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
        {products.map((product, productIdx) =>(
          <Pill
            key={`product-${productIdx}`}
            label={product.name}
            onRemove={() => removeProduct(product)}
            readOnly={ownedProjectProducts.length < 2 && ownedProducts.some(({ slug }) => slug === product.slug)}
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

export default ProjectDetailProducts
