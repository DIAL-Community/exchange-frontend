import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import ProductCard from './ProductCard'

const PRODUCTS_QUERY = gql`
query {
  products {
    id
    name
    slug
    imageFile
    productDescriptions {
      description
    }
  }
}
`

const ProductList = (props) => {
  return (
    <>
      <div id='content' className='container-fluid with-header'>
        <div className='row flex flex-wrap grid grid-cols-4 gap-3'>
          {props.productList.map((product) => {
            return <ProductCard key={product.id} product={product} />
          })}
        </div>
      </div>
    </>
  )
}

const ProductListQuery = () => {
  const { loading, error, data } = useQuery(PRODUCTS_QUERY)
  if (loading) {
    return <div>Fetching..</div>
  }
  if (error) {
    return <div>Error!</div>
  }
  return (
    <ProductList productList={data.products} />
  )
}

export default ProductListQuery
