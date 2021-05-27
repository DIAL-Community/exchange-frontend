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

import { useContext, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

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
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <Filter activeTab='filter.entity.products' />
      <SearchFilter {...{ search, setSearch, displayType, setDisplayType }} placeholder={format('app.search') + format('products.label')} />
      <ProductListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(Products)
