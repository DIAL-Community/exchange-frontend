/* eslint-disable max-len */
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import PageContent from '../../../../components/main/PageContent'
import ProductHint from '../../../../components/filter/hint/ProductHint'
import ProductActiveFilter from '../../../../components/products/ProductActiveFilter'
import SearchFilter from '../../../../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../../../components/context/ProductFilterContext'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../components/Header'
import Footer from '../components/Footer'

const ProductListQuery = dynamic(() => import('../../../../components/products/ProductList'), { ssr: false })

const Products = () => {

  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  return (
    <>
      <Header />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.products'
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
