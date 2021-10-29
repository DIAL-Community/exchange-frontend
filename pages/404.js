import Head from 'next/head'
import { useIntl } from 'react-intl'
import Footer from '../components/Footer'
import Header from '../components/Header'
import NotFound from '../components/shared/NotFound'

const Custom404 = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <NotFound />
      <Footer />
    </>
  )
}

export default Custom404
