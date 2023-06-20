import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import StorefrontDetail from '../../../components/organizations/storefronts/StorefrontDetail'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const Storefront = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <ClientOnly>
        <StorefrontDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Storefront
