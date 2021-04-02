import Head from 'next/head'
import { useIntl } from 'react-intl'

// import { I18nProvider } from './I18nProvider';
// import config from './config';
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
import { ProductFilterProvider } from '../components/context/ProductFilterContext'

const HomePage = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

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
      <ProductFilterProvider>
        <Filter activeTab='products' />
        <ProductListQuery />
      </ProductFilterProvider>
      <Footer />
    </>
  )
}

export default withApollo()(HomePage)
