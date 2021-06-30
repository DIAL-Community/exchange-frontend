import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from '../components/Header'
import Filter from '../components/filter/Filter'
import ProductListQuery from '../components/products/ProductList'
import withApollo from '../lib/apolloClient'
import Landing from '../components/Landing'
import Definition from '../components/Definition'
import WizardDescription from '../components/WizardDescription'
import Carousel from '../components/Carousel'
import CatalogTitle from '../components/CatalogTitle'
import Footer from '../components/Footer'
import SearchFilter from '../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../components/context/ProductFilterContext'
import { useContext } from 'react'

import dynamic from 'next/dynamic'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const HomePage = () => {
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
      <Landing />
      <Header />
      <Definition />
      <Carousel />
      <WizardDescription />
      <CatalogTitle />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <Filter activeTab='filter.entity.products' />
      <SearchFilter {...{ search, setSearch }} placeholder={format('app.search') + format('products.label')} />
      <ProductListQuery />
      <Footer />
    </>
  )
}

export default withApollo()(HomePage)
