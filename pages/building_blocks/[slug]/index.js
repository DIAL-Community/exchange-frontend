import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import BuildingBlockDetail from '../../../components/building-blocks/BuildingBlockDetail'
import ClientOnly from '../../../lib/ClientOnly'

const BuildingBlock = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <BuildingBlockDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default BuildingBlock
