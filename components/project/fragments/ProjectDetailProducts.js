import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ProductCard from '../../product/ProductCard'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { UPDATE_PROJECT_PRODUCTS } from '../../shared/mutation/project'
import { PRODUCT_SEARCH_QUERY } from '../../shared/query/product'
import { DisplayType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const ProjectDetailProducts = ({ project, editingAllowed, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [products, setProducts] = useState(project.products)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProjectProducts, { loading, reset }] = useMutation(UPDATE_PROJECT_PRODUCTS, {
    onError() {
      setIsDirty(false)
      setProducts(project?.products)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.product.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProjectProducts: response } = data
      if (response?.project && response?.errors?.length === 0) {
        setIsDirty(false)
        setProducts(response?.project?.products)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.product.header') }))
      } else {
        setIsDirty(false)
        setProducts(project?.products)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.product.header') }))
        reset()
      }
    }
  })

  const fetchedProductsCallback = (data) => (
    data.products?.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      label: product.name
    }))
  )

  const addProduct = (product) => {
    setProducts([
      ...[
        ...products.filter(({ id }) => id !== product.id),
        { id: product.id, name: product.name, slug: product.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeProduct = (product) => {
    setProducts([...products.filter(({ id }) => id !== product.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      updateProjectProducts({
        variables: {
          productSlugs: products.map(({ slug }) => slug),
          slug: project.slug
        },
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  const onCancel = () => {
    setProducts(project.products)
    setIsDirty(false)
  }

  const displayModeBody = products.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {products?.map((product, index) =>
        <ProductCard
          key={index}
          product={product}
          displayType={DisplayType.SMALL_CARD}
        />
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.product.label'),
        base: format('ui.project.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
      {format('ui.product.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.product.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, PRODUCT_SEARCH_QUERY, fetchedProductsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.product.label') })}
          onChange={addProduct}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {products.map((product, productIdx) => (
          <Pill
            key={`products-${productIdx}`}
            label={product.name}
            onRemove={() => removeProduct(product)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      editingAllowed={editingAllowed}
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

export default ProjectDetailProducts
