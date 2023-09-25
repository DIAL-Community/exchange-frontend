import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Header from '../../../../components/shared/Header'
import { Loading } from '../../../../components/shared/FetchStatus'
import Footer from '../../../../components/shared/Footer'

const PlaybookPlays = () => {
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    router.push(`/${router.locale}/playbooks/${slug}/`)
  }, [router, slug])

  return (
    <>
      <Header />
      <Loading />
      <Footer />
    </>
  )
}

export default PlaybookPlays
