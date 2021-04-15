import Head from 'next/head'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import ProductListQuery from '../../components/products/ProductList'
import Footer from '../../components/Footer'
import SearchFilter from '../../components/shared/SearchFilter'
import GradientBackground from '../../components/shared/GradientBackground'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../components/context/ProductFilterContext'
import { useContext } from 'react'

const Products = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search, displayType } = useContext(ProductFilterContext)
  const { setSearch, setDisplayType } = useContext(ProductFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GradientBackground />
      <Header />
      <Filter activeTab='products' />
      <SearchFilter {...{ search, setSearch, displayType, setDisplayType }} componentName='Product' />
      <ProductListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(Products)
