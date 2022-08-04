import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProductDetail from '../../../components/products/ProductDetail'
import ClientOnly from '../../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Product = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <ClientOnly>
        <ProductDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Product
