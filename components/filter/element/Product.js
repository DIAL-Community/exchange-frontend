import { useApolloClient } from '@apollo/client'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { PRODUCT_SEARCH_QUERY } from '../../../queries/product'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'

export const ProductAutocomplete = (props) => {
  const client = useApolloClient()
  const { products, setProducts, placeholder, containerStyles, controlSize } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  let controlPlaceholder = placeholder
  if (!controlPlaceholder) {
    controlPlaceholder = format('filter.byEntity', { entity: format('product.label') })
  }

  const addProduct = (product) => {
    setProducts([...products.filter(({label}) => label !== product.label), product])
  }

  const fetchOptions = async (input, callback, query) => {
    if (input && input.trim().length < 2) {
      return []
    }

    const response = await client.query({
      query: query,
      variables: {
        search: input
      }
    })

    if (response.data && response.data.products) {
      return response.data.products.map((product) => ({
        label: product.name,
        value: product.id,
        slug: product.slug
      }))
    }

    return []
  }

  return (
    <div className={classNames(containerStyles)} data-testid='product-search'>
      <Select
        aria-label={format('filter.byEntity', { entity: format('product.label') })}
        async
        cacheOptions
        defaultOptions
        loadOptions={(input, callback) => fetchOptions(input, callback, PRODUCT_SEARCH_QUERY)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('product.header') })}
        onChange={addProduct}
        placeholder={controlPlaceholder}
        value={null}
        controlSize={controlSize}
      />
    </div>
  )
}

export const ProductFilters = (props) => {
  const { products, setProducts } = props

  const removeProduct = (productId) => {
    setProducts(products.filter(product => product.label !== productId))
  }

  return (
    <>
      {products?.map((product, productIdx) => (
        <Pill
          key={`product-${productIdx}`}
          label={product.label}
          onRemove={() => removeProduct(product.label)}
        />
      ))}
    </>
  )
}
