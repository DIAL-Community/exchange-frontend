
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import OrganizationDetail from '../../../components/organizations/OrganizationDetail'
import ClientOnly from '../../../lib/ClientOnly'

const Organization = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <OrganizationDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Organization
