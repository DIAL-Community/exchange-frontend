import Head from 'next/head'
import styles from '../styles/Home.module.css'

// import { I18nProvider } from './I18nProvider';
// import config from './config';
import Header from '../components/Header'
import Filter from '../components/Filter'
import ProductListQuery from '../components/products/ProductList'
import withApollo from '../lib/apolloClient'

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>DIAL Catalog of Digital Solutions</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Filter />
      <ProductListQuery />
      <footer className={styles.footer} />
    </div>
  )
}

export default withApollo()(HomePage)
