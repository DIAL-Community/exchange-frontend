import { useContext } from 'react'
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
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'
import { useUser } from '../../../lib/hooks'
const ProductListQuery = dynamic(() =>
  import('../../../components/candidate/products/ProductList'), { ssr: false })
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Products = () => {
  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <Header />
      {loadingUserSession ? <Loading /> : isAdminUser ? (
        <ClientOnly>
          <TabNav activeTab='filter.entity.candidateProducts' />
          <MobileNav activeTab='filter.entity.candidateProducts' />
          <PageContent
            content={<ProductListQuery />}
            searchFilter={
              <SearchFilter
                {...{ search, setSearch }}
                hint='filter.entity.candidateProducts'
              />
            }
          />
        </ClientOnly>
      ) : <Unauthorized />}
      <Footer />
    </>
  )
}

export default Products
