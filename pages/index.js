import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Landing from '../components/Landing'
import Definition from '../components/Definition'
import WizardDescription from '../components/WizardDescription'
import Carousel from '../components/Carousel'
import CatalogTitle from '../components/CatalogTitle'
import Footer from '../components/Footer'
import TabNav from '../components/main/TabNav'
import MobileNav from '../components/main/MobileNav'
import PageContent from '../components/main/PageContent'
import ProductHint from '../components/filter/hint/ProductHint'
import ProductFilter from '../components/products/ProductFilter'
import ProductActiveFilter from '../components/products/ProductActiveFilter'
import ProductListQuery from '../components/products/ProductList'
import SearchFilter from '../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../components/context/ProductFilterContext'
import ClientOnly from '../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const HomePage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

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
      <TabNav activeTab='filter.entity.products' />
      <MobileNav activeTab='filter.entity.products' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.products'
          filter={<ProductFilter />}
          content={<ProductListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.products' />}
          activeFilter={<ProductActiveFilter />}
          hint={<ProductHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default HomePage
