import { useRouter } from 'next/router'
import ProductDetail from '../../../../components/candidate/products/ProductDetail'
import Footer from '../../../../components/Footer'
import Header from '../../../../components/Header'
import ClientOnly from '../../../../lib/ClientOnly'

const CandidateProduct = () => {
  const { locale, query: { slug } } = useRouter()

  return (
    <>
      <Header />
      <ClientOnly>
        <ProductDetail productSlug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CandidateProduct
