import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { gql, useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'

// https://github.com/JedWatson/react-select/issues/3590
const AsyncSelect = dynamic(() => import('react-select/async'), { ssr: false })

const PRODUCT_SEARCH_QUERY = gql`
  query Products($search: String!) {
    products(search: $search) {
      id
      name
    }
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '12rem',
    cursor: 'pointer'
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer'
  })
}

export const ProductAutocomplete = (props) => {
  const client = useApolloClient()
  const { products, setProducts, containerStyles } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const selectProduct = (product) => {
    setProducts([...products.filter(p => p.value !== product.value), product])
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
        value: product.id
      }))
    }

    return []
  }

  return (
    <div className={`${containerStyles} text-dial-gray-dark flex`}>
      <label className='block mt-4'>
        <span className='text-sm text-dial-gray-light'>
          {format('product.header')}
        </span>
        <AsyncSelect
          className='rounded text-sm text-dial-gray-dark mt-1 block w-full'
          cacheOptions
          defaultOptions
          loadOptions={(input, callback) => fetchOptions(input, callback, PRODUCT_SEARCH_QUERY)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('product.header') })}
          onChange={selectProduct}
          placeholder={format('filter.byEntity', { entity: format('product.label') })}
          styles={customStyles}
        />
      </label>
    </div>
  )
}

export const ProductFilters = (props) => {
  const { products, setProducts } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeProduct = (productId) => {
    setProducts(products.filter(product => product.value !== productId))
  }

  return (
    <>
      {
        products &&
          products.map(product => (
            <div key={`filter-${product.label}`} className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
              {`${format('product.label')}: ${product.label}`}
              <MdClose className='ml-3 inline cursor-pointer' onClick={() => removeProduct(product.value)} />
            </div>
          ))
      }
    </>
  )
}
