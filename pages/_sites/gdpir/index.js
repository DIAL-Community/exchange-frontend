import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from './components/Header'
import Landing from './components/Landing'
import Footer from './components/Footer'

const HomePage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Landing />
      <Footer />
    </>
  )
}

export default HomePage
