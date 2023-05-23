import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GradientBackground from '../../components/shared/GradientBackground'
import QueryNotification from '../../components/shared/QueryNotification'
import MobileNav from '../../components/main/MobileNav'
import TabNav from '../../components/main/TabNav'
import PageContent from '../../components/main/PageContent'
import SearchFilter from '../../components/shared/SearchFilter'
import PlaybookFilter from '../../components/playbooks/PlaybookFilter'
import PlaybookActiveFilter from '../../components/playbooks/PlaybookActiveFilter'
import { PlaybookFilterContext, PlaybookFilterDispatchContext }
  from '../../components/context/PlaybookFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const PlaybookListQuery = dynamic(() => import('../../components/playbooks/PlaybookList'), { ssr: false })
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const Playbooks = () => {
  const { search } = useContext(PlaybookFilterContext)
  const { setSearch } = useContext(PlaybookFilterDispatchContext)

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <ClientOnly>
        <TabNav activeTab='filter.entity.playbooks' />
        <MobileNav activeTab='filter.entity.playbooks' />
        <PageContent
          activeTab='filter.entity.playbooks'
          filter={<PlaybookFilter />}
          content={<PlaybookListQuery />}
          searchFilter={
            <SearchFilter
              {...{ search, setSearch }}
              hint='filter.entity.playbooks'
            />
          }
          activeFilter={<PlaybookActiveFilter />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Playbooks
