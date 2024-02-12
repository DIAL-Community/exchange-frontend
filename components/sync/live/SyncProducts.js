import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { PRODUCT_SEARCH_QUERY } from '../../shared/query/product'
import { fetchSelectOptions } from '../../utils/search'

const SyncProducts = ({ products, setProducts }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const fetchProductsCallback = (data) => (
    data.products?.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      label: product.name
    }))
  )

  const removeProduct = (product) => {
    setProducts([...products.filter(({ id }) => id !== product.id)])
  }

  const addProduct = (product) => {
    setProducts([
      ...[
        ...products.filter(({ id }) => id !== product.id),
        { id: product.id, name: product.name, slug: product.slug }
      ]
    ])
  }

  return (

    <div className='flex flex-col'>
      <ul className="flex flex-wrap gap-x-4 -mb-px">
        <li className="me-2">
          <div href='#' className='inline-block py-3 border-b-2 border-dial-sunshine'>
            {format('ui.product.header')}
          </div>
        </li>
      </ul>
      <div className='flex flex-col gap-y-3 border px-6 py-4'>
        <label className='flex flex-col gap-y-2'>
          {`${format('ui.syncTenant.searchFor')} ${format('ui.product.label')}`}
          <Select
            async
            isSearch
            isBorderless
            defaultOptions
            cacheOptions
            placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
            loadOptions={(input) =>
              fetchSelectOptions(client, input, PRODUCT_SEARCH_QUERY, fetchProductsCallback)
            }
            noOptionsMessage={() => format('ui.syncTenant.searchFor', { entity: format('ui.product.label') })}
            onChange={addProduct}
            value={null}
          />
        </label>
        <div className='flex flex-wrap gap-3'>
          {products.map((product, productIdx) => (
            <Pill
              key={`author-${productIdx}`}
              label={product.name}
              onRemove={() => removeProduct(product)}
            />
          ))}
        </div>
      </div>
    </div>
  )

}

export default SyncProducts
