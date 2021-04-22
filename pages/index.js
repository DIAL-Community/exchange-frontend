import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from '../components/Header'
import Filter from '../components/filter/Filter'
import ProductListQuery from '../components/products/ProductList'
import withApollo from '../lib/apolloClient'
import Landing from '../components/Landing'
import Definition from '../components/Definition'
import Carousel from '../components/Carousel'
import WizardDescription from '../components/WizardDescription'
import CatalogTitle from '../components/CatalogTitle'
import Footer from '../components/Footer'
import SearchFilter from '../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../components/context/ProductFilterContext'
import { useContext } from 'react'

const HomePage = () => {
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
      <Landing />
      <Header />
      <Definition />
      <Carousel />
      <WizardDescription />
      <CatalogTitle />
      <Filter activeTab='products' />
      <SearchFilter {...{ search, setSearch, displayType, setDisplayType }} placeholder='Search for a Product' />
      <ProductListQuery />
      <Footer />
    </>
  )
}

export default withApollo()(HomePage)
