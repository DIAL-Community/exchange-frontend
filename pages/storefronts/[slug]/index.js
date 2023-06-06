import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import StorefrontDetail from '../../../components/organizations/storefronts/StorefrontDetail'

const Storefront = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <StorefrontDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Storefront
