import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import OpportunityDetail from '../../../components/opportunities/OpportunityDetail'
import ClientOnly from '../../../lib/ClientOnly'

const Opportunity = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <OpportunityDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Opportunity
