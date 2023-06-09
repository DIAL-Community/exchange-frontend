import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import SearchFilter from '../../../components/shared/SearchFilter'
import { DatasetFilterContext, DatasetFilterDispatchContext }
  from '../../../components/context/candidate/DatasetFilterContext'
import PageContent from '../../../components/main/PageContent'
import TabNav from '../../../components/main/TabNav'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'
import MobileNav from '../../../components/main/MobileNav'
const DatasetListQuery = dynamic(() =>
  import('../../../components/candidate/datasets/DatasetList'), { ssr: false })
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const Datasets = () => {
  const { search } = useContext(DatasetFilterContext)
  const { setSearch } = useContext(DatasetFilterDispatchContext)

  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <Header />
      {loadingUserSession ? <Loading /> : isAdminUser ? (
        <ClientOnly>
          <TabNav activeTab='filter.entity.candidateDatasets' />
          <MobileNav activeTab='filter.entity.candidateDatasets' />
          <PageContent
            content={<DatasetListQuery />}
            searchFilter={
              <SearchFilter
                {...{ search, setSearch }}
                hint='filter.entity.candidateDatasets'
              />
            }
          />
        </ClientOnly>
      ) : <Unauthorized />}
      <Footer />
    </>
  )
}

export default Datasets
