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
import PlaybookHint from '../../components/filter/hint/PlaybookHint'
import { PlaybookFilterContext, PlaybookFilterDispatchContext } from '../../components/context/PlaybookFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const PlaybookListQuery = dynamic(() => import('../../components/playbooks/PlaybookList'), { ssr: false })
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Playbooks = () => {
  const { search } = useContext(PlaybookFilterContext)
  const { setSearch } = useContext(PlaybookFilterDispatchContext)

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <TabNav activeTab='filter.entity.playbooks' />
      <MobileNav activeTab='filter.entity.playbooks' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.playbooks'
          filter={<PlaybookFilter />}
          content={<PlaybookListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.playbooks' />}
          activeFilter={<PlaybookActiveFilter />}
          hint={<PlaybookHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Playbooks
