import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { BsPlus } from 'react-icons/bs'
import { useApolloClient } from '@apollo/client'
import Select from '../form/Select'
import { fetchSelectOptions } from '../../utils/search'
import { PRODUCT_SEARCH_QUERY } from '../query/product'

export const ProductAutocomplete = ({ products, setProducts, placeholder }) => {
  const client = useApolloClient()

  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('ui.product.label') })

  const selectProduct = (product) => {
    setProducts([...products.filter(s => s.value !== product.value), product])
  }

  const fetchCallback = (data) => (
    data?.products.map((product) => ({
      label: product.name,
      value: product.id,
      slug: product.slug
    }))
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <button className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm ml-4 py-2'>
          {format('ui.product.label')}
        </div>
        <BsPlus className='ml-auto my-auto' />
      </button>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.product.label') })}
          className='ml-4 rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={(input) => fetchSelectOptions(client, input, PRODUCT_SEARCH_QUERY, fetchCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.product.label') })}
          onChange={selectProduct}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const ProductActiveFilters = ({ products, setProducts }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeProduct = (productSlug) => {
    setProducts(products => [...products.filter(product => product.slug !== productSlug)])
  }

  return (
    <>
      {products?.map((product, productIndex) => (
        <div key={productIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {product.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.product.label')})
              </div>
            </div>
            <button onClick={() => removeProduct(product.slug)}>
              <IoClose size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
