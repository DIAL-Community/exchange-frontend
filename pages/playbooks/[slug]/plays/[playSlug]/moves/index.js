import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Loading } from '../../../../../../ui/v1/shared/FetchStatus'
import Header from '../../../../../../ui/v1/shared/Header'
import Footer from '../../../../../../ui/v1/shared/Footer'

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
