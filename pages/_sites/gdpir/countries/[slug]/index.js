/* eslint-disable max-len */
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GradientBackground from '../../../../../components/shared/GradientBackground'
import QueryNotification from '../../../../../components/shared/QueryNotification'
import PageContent from '../../../../../components/main/PageContent'
import ProductHint from '../../../../../components/filter/hint/ProductHint'
import ProductFilter from '../../../../../components/products/ProductFilter'
import ProductActiveFilter from '../../../../../components/products/ProductActiveFilter'
import SearchFilter from '../../../../../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../../../../components/context/ProductFilterContext'
import ClientOnly from '../../../../../lib/ClientOnly'
const ProductListQuery = dynamic(() => import('../../../../../components/products/ProductList'), { ssr: false })

const Products = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { search } = useContext(ProductFilterContext)
  const { setSearch, setOrigins } = useContext(ProductFilterDispatchContext)
  const country = router.query?.slug
  useEffect(() => {
    setOrigins([{ label:'India', slug:'india', value: '9' }])
  }, [])

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <div className='text-dial-gray-dark my-5 mx-10 text-xl'>The following products have been identified by {country} as Digital Public Infrastructure</div>
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
