import Head from 'next/head'
import { useIntl } from 'react-intl'

import apolloClient from '../../../../../lib/apolloClient'

import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import QueryNotification from '../../../../../components/shared/QueryNotification'
import GradientBackground from '../../../../../components/shared/GradientBackground'

const ProductRepository = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <Footer />
    </>
  )
}

export default apolloClient()(ProductRepository)
