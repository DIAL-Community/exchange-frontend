import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProductDetail from '../../../components/products/ProductDetail'
import ClientOnly from '../../../lib/ClientOnly'
import { addApolloState, initializeApollo } from '../../../lib/apolloClient'
import { PRODUCT_QUERY } from '../../../queries/product'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Product = ({ slug, locale }) => (
  <>
    <Header />
    <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
    <ClientOnly>
      <ProductDetail slug={slug} locale={locale} />
    </ClientOnly>
    <Footer />
  </>
)

export async function getServerSideProps(context) {
  const client = initializeApollo({})
  const { locale, params: { slug } } = context
  await client.query({
    query: PRODUCT_QUERY,
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  return addApolloState(client, {
    props: { slug, locale }
  })
}

export default Product
