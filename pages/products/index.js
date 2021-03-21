import { useIntl } from 'react-intl'

const Products = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <h1>{format('products.header')}</h1>
  )
}

export default Products
