import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import Footer from '../../../../components/Footer'
import Header from '../../../../components/Header'
import { Loading } from '../../../../components/shared/FetchStatus'

const PlaybookPlays = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug } = router.query
  useEffect(() => {
    router.push(`/${router.locale}/playbooks/${slug}/edit`)
  }, [router, slug])

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

export default PlaybookPlays
