import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Loading } from '../../../../../../components/shared/FetchStatus'
import Header from '../../../../../../components/shared/Header'
import Footer from '../../../../../../components/shared/Footer'

const PlayMoves = () => {
  const router = useRouter()
  const { locale, query: { slug } } = router

  useEffect(() => {
    router.push(`/${locale}/playbooks/${slug}`)
  }, [router, slug, locale])

  return (
    <>
      <Header />
      <Loading />
      <Footer />
    </>
  )
}

export default PlayMoves
