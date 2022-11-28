import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProductDetail from '../../../components/products/ProductDetail'
import ClientOnly from '../../../lib/ClientOnly'
import { addApolloState, initializeApollo } from '../../../lib/apolloClient'
import { PRODUCT_CATEGORY_INDICATORS_QUERY, PRODUCT_QUERY } from '../../../queries/product'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Product = ({ data }) => (
  <>
    <Header />
    <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
    <ClientOnly>
      <ProductDetail product={data.product} />
    </ClientOnly>
    <Footer />
  </>
)

export async function getServerSideProps(context) {
  const client = initializeApollo({})
  const { locale, params: { slug } } = context
  const { data: productData } = await client.query({
    query: PRODUCT_QUERY,
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })
  const { data: categoryIndicatorsData } = await client.query({
    query: PRODUCT_CATEGORY_INDICATORS_QUERY,
    variables: { slug }
  })

  return addApolloState(client, {
    props: { data: productData, categoryIndicatorsData }
  })
}

export default Product
