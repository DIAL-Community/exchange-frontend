import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import apolloClient from '../../../lib/apolloClient'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../../components/context/candidate/ProductFilterContext'
import SearchFilter from '../../../components/shared/SearchFilter'

import dynamic from 'next/dynamic'
const ProductListQuery = dynamic(() => import('../../../components/candidate/products/ProductList'), { ssr: false })
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Products = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <SearchFilter {...{ search, setSearch }} placeholder={`${format('app.search')}${format('candidateProduct.label')}`} />
      <ProductListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(Products)
