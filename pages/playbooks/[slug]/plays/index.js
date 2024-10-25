import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Footer from '../../../../components/shared/Footer'
import Header from '../../../../components/shared/Header'
import { handleLoadingSession } from '../../../../components/shared/SessionQueryHandler'

const PlaybookPlays = () => {
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    router.push(`/${router.locale}/playbooks/${slug}/`)
  }, [router, slug])

  return (
    <>
      <Header />
      {handleLoadingSession()}
      <Footer />
    </>
  )
}

export default PlaybookPlays
