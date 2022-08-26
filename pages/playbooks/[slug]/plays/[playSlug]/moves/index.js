import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Footer from '../../../../../../components/Footer'
import Header from '../../../../../../components/Header'
import { Loading } from '../../../../../../components/shared/FetchStatus'

const PlayMoves = () => {
  const router = useRouter()
  const { slug, playSlug } = router.query
  useEffect(() => {
    router.push(`/${router.locale}/playbooks/${slug}/plays/${playSlug}/edit`)
  }, [router, slug, playSlug])

  return (
    <>
      <Header />
      <Loading />
      <Footer />
    </>
  )
}

export default PlayMoves
