import Header from '../../components/Header'
import Definition from '../../components/Definition'
import Footer from '../../components/Footer'

import Head from 'next/head'
import { useIntl } from 'react-intl'

const AboutPage = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Definition />
      <Footer />
    </>
  )
}

export default AboutPage
