import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import SDGDetail from '../../../components/sdgs/SDGDetail'
import ClientOnly from '../../../lib/ClientOnly'

const SDG = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { slug } = router.query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ClientOnly>
        <SDGDetail slug={slug} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default SDG
