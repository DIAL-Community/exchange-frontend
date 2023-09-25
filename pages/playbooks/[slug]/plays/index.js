import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Header from '../../../../ui/v1/shared/Header'
import { Loading } from '../../../../ui/v1/shared/FetchStatus'
import Footer from '../../../../ui/v1/shared/Footer'

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
