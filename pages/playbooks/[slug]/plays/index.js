import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Footer from '../../../../components/Footer'
import Header from '../../../../components/Header'
import { Loading } from '../../../../components/shared/FetchStatus'

const PlaybookPlays = () => {
  const router = useRouter()
  const { slug } = router.query
  useEffect(() => {
    router.push(`/${router.locale}/playbooks/${slug}/edit`)
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
