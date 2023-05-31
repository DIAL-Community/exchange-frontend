import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ResourceDetail from '../../../components/resources/ResourceDetail'
import ClientOnly from '../../../lib/ClientOnly'

const Resource = () => {
  const router = useRouter()

  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <ResourceDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Resource
