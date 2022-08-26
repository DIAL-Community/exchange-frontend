import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GradientBackground from '../../components/shared/GradientBackground'
import QueryNotification from '../../components/shared/QueryNotification'
import TabNav from '../../components/main/TabNav'
import MobileNav from '../../components/main/MobileNav'
import PageContent from '../../components/main/PageContent'
import DatasetHint from '../../components/filter/hint/DatasetHint'
import DatasetFilter from '../../components/datasets/DatasetFilter'
import DatasetActiveFilter from '../../components/datasets/DatasetActiveFilter'
import SearchFilter from '../../components/shared/SearchFilter'
import { DatasetFilterContext, DatasetFilterDispatchContext } from '../../components/context/DatasetFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })
const DatasetListQuery = dynamic(() => import('../../components/datasets/DatasetList'), { ssr: false })

const Datasets = () => {
  const { search } = useContext(DatasetFilterContext)
  const { setSearch } = useContext(DatasetFilterDispatchContext)

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <TabNav activeTab='filter.entity.datasets' />
      <MobileNav activeTab='filter.entity.datasets' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.datasets'
          filter={<DatasetFilter />}
          content={<DatasetListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.datasets' />}
          activeFilter={<DatasetActiveFilter />}
          hint={<DatasetHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Datasets
