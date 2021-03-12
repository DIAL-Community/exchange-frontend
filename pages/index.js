import Head from 'next/head'
import styles from '../styles/Home.module.css'

// import { I18nProvider } from './I18nProvider';
// import config from './config';
import Header from "../components/Header";
import ProductListQuery from '../components/products/ProductList';
import { withApollo } from '../lib/withApollo'

const HomePage = () => {
  return (
    <div className={styles.container}>
    <Head>
      <title>DIAL Catalog of Digital Solutions</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <ProductListQuery />
    <footer className={styles.footer}>

    </footer>
  </div>
  )
}

export default withApollo()(HomePage)