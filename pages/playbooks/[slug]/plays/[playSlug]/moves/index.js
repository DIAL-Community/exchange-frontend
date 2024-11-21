import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Footer from '../../../../../../components/shared/Footer'
import Header from '../../../../../../components/shared/Header'
import { handleLoadingSession } from '../../../../../../components/shared/SessionQueryHandler'

const PlayMoves = () => {
  const router = useRouter()
  const { locale, query: { slug } } = router

  useEffect(() => {
    router.push(`/${locale}/playbooks/${slug}`)
  }, [router, slug, locale])

  return (
    <>
      <Header />
      {handleLoadingSession()}
      <Footer />
    </>
  )
}

export default PlayMoves
