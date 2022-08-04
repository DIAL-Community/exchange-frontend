import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import SDGDetail from '../../../components/sdgs/SDGDetail'
import ClientOnly from '../../../lib/ClientOnly'

const SDG = () => {
  const router = useRouter()
  const { slug } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        <SDGDetail slug={slug} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default SDG
