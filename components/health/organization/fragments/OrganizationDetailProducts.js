import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import Select from '../../../shared/form/Select'
import EditableSection from '../../../shared/EditableSection'
import Pill from '../../../shared/form/Pill'
import { fetchSelectOptions } from '../../../utils/search'
import { DisplayType } from '../../../utils/constants'
import { UPDATE_ORGANIZATION_PRODUCTS } from '../../../shared/mutation/organization'
import ProductCard from '../../product/fragments/ProductCard'
import { PRODUCT_SEARCH_QUERY } from '../../../shared/query/product'

const OrganizationDetailProducts = ({ organization, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [products, setProducts] = useState(organization.products)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOrganizationProducts, { loading, reset }] = useMutation(UPDATE_ORGANIZATION_PRODUCTS, {
    onError() {
      setIsDirty(false)
      setProducts(organization?.products)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.product.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateOrganizationProducts: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setIsDirty(false)
        setProducts(response?.organization?.products)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.product.header') }))
      } else {
        setIsDirty(false)
        setProducts(organization?.products)
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
      const { userEmail, userToken } = user

      updateOrganizationProducts({
        variables: {
          productSlugs: products.map(({ slug }) => slug),
          slug: organization.slug
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
    setProducts(organization.products)
    setIsDirty(false)
  }

  const displayModeBody = products.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {products?.map((product, index) =>
        <div key={`product-${index}`}>
          <ProductCard product={product} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.product.label'),
        base: format('ui.organization.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-health-blue' ref={headerRef}>
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

export default OrganizationDetailProducts
