import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Footer from '../../../../components/Footer'
import Header from '../../../../components/Header'
import { Loading } from '../../../../components/shared/FetchStatus'
import { useUser } from '../../../../lib/hooks'

const PlaybookPlays = () => {
  const { isAdminUser } = useUser()

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    if (isAdminUser) {
      router.push(`/${router.locale}/playbooks/${slug}/edit`)
    } else {
      router.push(`/${router.locale}/playbooks/${slug}/`)
    }
  }, [router, slug, isAdminUser])

  return (
    <>
      <Header />
      <Loading />
      <Footer />
    </>
  )
}

export default PlaybookPlays
