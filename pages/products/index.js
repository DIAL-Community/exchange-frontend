import { useCallback, useContext } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GradientBackground from '../../components/shared/GradientBackground'
import QueryNotification from '../../components/shared/QueryNotification'
import TabNav from '../../components/main/TabNav'
import MobileNav from '../../components/main/MobileNav'
import PageContent from '../../components/main/PageContent'
import ProductFilter from '../../components/products/ProductFilter'
import ProductActiveFilter from '../../components/products/ProductActiveFilter'
import SearchFilter from '../../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../components/context/ProductFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })
const ProductListQuery = dynamic(() => import('../../components/products/ProductList'), { ssr: false })

const Products = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  return (
    <>
      <NextSeo
        title={format('products.header')}
        description={
          format(
            'shared.metadata.description.comprehensiveListOf',
            { entities: format('products.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <ClientOnly>
        <TabNav activeTab='filter.entity.products' />
        <MobileNav activeTab='filter.entity.products' />
        <PageContent
          activeTab='filter.entity.products'
          filter={<ProductFilter />}
          content={<ProductListQuery />}
          searchFilter={
            <SearchFilter
              {...{ search, setSearch }}
              hint='filter.entity.products'
            />
          }
          activeFilter={<ProductActiveFilter />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Products
