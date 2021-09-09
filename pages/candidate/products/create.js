import Head from 'next/head'
import { useIntl } from 'react-intl'

import apolloClient from '../../../lib/apolloClient'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import ProductForm from '../../../components/candidate/products/ProductForm'

const CreateProduct = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ProductForm />
      <Footer />
    </>
  )
}

export default apolloClient()(CreateProduct)
