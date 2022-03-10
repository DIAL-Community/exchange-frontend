import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

import withApollo from '../../../lib/apolloClient'

import { PlaybookDetailProvider } from '../../../components/playbooks/PlaybookDetailContext'
import PlaybookDetail from '../../../components/playbooks/PlaybookDetail'

const Playbook = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { pathname, asPath, query } = useRouter()

  const { slug } = router.query

  useEffect(() => {
    if (query.locale) {
      router.replace({ pathname }, asPath, { locale: query.locale })
    }
  })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <PlaybookDetailProvider>
        <PlaybookDetail slug={slug} />
      </PlaybookDetailProvider>
      <Footer />
    </>
  )
}

export default withApollo()(Playbook)
