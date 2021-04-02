import Head from 'next/head'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import ProductListQuery from '../../components/products/ProductList'
import Footer from '../../components/Footer'
import { ProductFilterProvider } from '../../components/context/ProductFilterContext'

const Products = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ProductFilterProvider>
        <Filter activeTab='products' />
        <ProductListQuery />
      </ProductFilterProvider>
      <Footer />
    </>
  )
}

export default apolloClient()(Products)
