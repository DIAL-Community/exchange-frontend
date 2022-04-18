import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import SearchFilter from '../../../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext }
  from '../../../components/context/candidate/ProductFilterContext'
import MobileNav from '../../../components/main/MobileNav'
import PageContent from '../../../components/main/PageContent'
import TabNav from '../../../components/main/TabNav'
import ClientOnly from '../../../lib/ClientOnly'
const ProductListQuery = dynamic(() =>
  import('../../../components/candidate/products/ProductList'), { ssr: false })
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

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
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <Header />
      <TabNav activeTab='filter.entity.candidateProducts' />
      <MobileNav activeTab='filter.entity.candidateProducts' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.candidateProducts'
          content={<ProductListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.candidateProducts' />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Products
