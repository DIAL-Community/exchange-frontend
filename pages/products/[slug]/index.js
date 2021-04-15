import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import withApollo from '../../../lib/apolloClient'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import ProductDetailLeft from '../../../components/products/ProductDetailLeft'
import ProductDetailRight from '../../../components/products/ProductDetailRight'

const PRODUCT_QUERY = gql`
query Product($slug: String!) {
  product(slug: $slug) {
    id
    name
    slug
    imageFile
    website
    repository
    license
    statistics
    languageData
    owner
    codeLines
    cocomo
    productDescriptions {
      description
    }
    origins {
      name
    }
    organizations {
      name
      slug
      isEndorser
      whenEndorsed
    }
    currProjects(first:10) {
      name
      slug
      origin {
        slug
      }
    }
    buildingBlocks {
      name
      slug
      imageFile
      maturity
    }
    sustainableDevelopmentGoals {
      id
      name
      slug
      imageFile
    }
    sectors {
      name
      slug
    }
  }
}
`

const Product = () => {
  const router = useRouter()
  const { slug } = router.query
  const { loading, error, data } = useQuery(PRODUCT_QUERY, { variables: {slug: slug}})

  if (loading) {
    return <><Header /><div>Fetching..</div><Footer /></>
  }
  if (error) {
    return <div>Error!</div>
  }

  const product = data.product
  return (
    <>  
      <Header />
      <div className='w-full h-full flex p-6 page-gradient'>
        <div className='w-1/4 pl-12 pt-4'>
          <ProductDetailLeft product={product} />
        </div>
        <div className='w-3/4 pt-4 h-screen overflow-y-scroll'>
          <ProductDetailRight product={product} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(Product)
