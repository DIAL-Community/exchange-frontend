import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import GradientBackground from '../../../../components/shared/GradientBackground'
import QueryNotification from '../../../../components/shared/QueryNotification'
import TabNav from '../../../../components/main/TabNav'
import MobileNav from '../../../../components/main/MobileNav'
import PageContent from '../../../../components/main/PageContent'
import ProductHint from '../../../../components/filter/hint/ProductHint'
import ProductFilter from '../../../../components/products/ProductFilter'
import ProductActiveFilter from '../../../../components/products/ProductActiveFilter'
import SearchFilter from '../../../../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../../../components/context/ProductFilterContext'
import ClientOnly from '../../../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })
const ProductListQuery = dynamic(() => import('../../../../components/products/ProductList'), { ssr: false })

const Products = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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

export default Products
