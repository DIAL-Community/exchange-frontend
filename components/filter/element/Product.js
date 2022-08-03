import { useApolloClient } from '@apollo/client'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import { fetchSelectOptions } from '../../../queries/utils'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'

export const ProductAutocomplete = ({
  products,
  setProducts,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('product.label') })

  const addProduct = (product) => {
    setProducts([...products.filter(({ label }) => label !== product.label), product])
  }

  const fetchedProductsCallback = (data) => (
    data?.products.map((product) => ({
      label: product.name,
      value: product.id,
      slug: product.slug
    }))
  )

  return (
    <div className={classNames(containerStyles)} data-testid='product-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('product.label') })}
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, PRODUCT_SEARCH_QUERY, fetchedProductsCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('product.header') })}
        onChange={addProduct}
        placeholder={controlPlaceholder}
        value={null}
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const ProductFilters = (props) => {
  const { products, setProducts } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const removeProduct = (productSlug) => {
    setProducts(products.filter(({ slug }) => slug !== productSlug))
  }

  return (
    <>
      {products?.map((product, productIdx) => (
        <div className='py-1' key={productIdx}>
          <Pill
            key={`product-${productIdx}`}
            label={`${format('product.label')}: ${product.label}`}
            onRemove={() => removeProduct(product.slug)}
          />
        </div>
      ))}
    </>
  )
}
