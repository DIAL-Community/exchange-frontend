import Head from 'next/head'

// import { I18nProvider } from './I18nProvider';
// import config from './config';
import Header from '../components/Header'
import Filter from '../components/Filter'
import ProductListQuery from '../components/products/ProductList'
import withApollo from '../lib/apolloClient'
import Landing from '../components/Landing'
import Description from '../components/Description'
import Carousel from '../components/Carousel'
import WizardDescription from '../components/WizardDescription'

const HomePage = () => {
  return (
    <>
      <Head>
        <title>DIAL Catalog of Digital Solutions</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Landing />
      <Header />
      <Description />
      <Carousel />
      <WizardDescription />
      <Filter />
      <ProductListQuery />
    </>
  )
}

export default withApollo()(HomePage)
