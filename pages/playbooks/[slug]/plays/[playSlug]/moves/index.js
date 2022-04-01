import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import Footer from '../../../../../../components/Footer'
import Header from '../../../../../../components/Header'
import { Loading } from '../../../../../../components/shared/FetchStatus'

const PlayMoves = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug, playSlug } = router.query
  useEffect(() => {
    router.push(`/${router.locale}/playbooks/${slug}/plays/${playSlug}/edit`)
  }, [router, slug, playSlug])

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Loading />
      <Footer />
    </>
  )
}

export default PlayMoves
