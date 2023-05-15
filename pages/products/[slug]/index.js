import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProductDetail from '../../../components/products/ProductDetail'
import ClientOnly from '../../../lib/ClientOnly'
import { addApolloState, initializeApollo } from '../../../lib/apolloClient'
import { PRODUCT_QUERY } from '../../../queries/product'
import NotFound from '../../../components/shared/NotFound'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const Product = ({ data }) => (
  <>
    <Header />
    <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
    <ClientOnly>
      {!data?.product && <NotFound />}
      {data?.product && <ProductDetail product={data.product} />}
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

  return addApolloState(client, {
    props: { data: productData }
  })
}

export default Product
