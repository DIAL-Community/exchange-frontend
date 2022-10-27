import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Footer from '../../../../../../components/Footer'
import Header from '../../../../../../components/Header'
import { Loading } from '../../../../../../components/shared/FetchStatus'
import { useUser } from '../../../../../../lib/hooks'

const PlayMoves = () => {
  const { isAdminUser } = useUser()

  const router = useRouter()
  const { slug, playSlug } = router.query

  useEffect(() => {
    if (isAdminUser) {
      router.push(`/${router.locale}/playbooks/${slug}/plays/${playSlug}/edit`)
    } else {
      router.push(`/${router.locale}/playbooks/${slug}/plays/${playSlug}`)
    }
  }, [router, slug, playSlug, isAdminUser])

  return (
    <>
      <Header />
      <Loading />
      <Footer />
    </>
  )
}

export default PlayMoves
