import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
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
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <PlaybookDetailProvider>
        <PlaybookDetail slug={slug} locale={locale} />
      </PlaybookDetailProvider>
      <Footer />
    </>
  )
}

export default withApollo()(Playbook)
