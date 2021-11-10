import Header from '../../components/Header'
import Definition from '../../components/Definition'
import Footer from '../../components/Footer'

import Head from 'next/head'
import { useIntl } from 'react-intl'
import Carousel from '../../components/Carousel'

const AboutPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)
  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Definition />
      <Carousel />
      <Footer />
    </>
  )
}

export default AboutPage
