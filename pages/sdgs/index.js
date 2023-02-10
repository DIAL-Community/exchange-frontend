import { useContext } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import SDGFilter from '../../components/sdgs/SDGFilter'
import SDGListQuery from '../../components/sdgs/SDGList'
import SearchFilter from '../../components/shared/SearchFilter'
import { SDGFilterContext, SDGFilterDispatchContext } from '../../components/context/SDGFilterContext'
import ClientOnly from '../../lib/ClientOnly'
import MobileNav from '../../components/main/MobileNav'
import TabNav from '../../components/main/TabNav'
import SDGActiveFilter from '../../components/sdgs/SDGActiveFilter'
import PageContent from '../../components/main/PageContent'

const SDGs = () => {
  const { search } = useContext(SDGFilterContext)
  const { setSearch } = useContext(SDGFilterDispatchContext)

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        <TabNav activeTab='filter.entity.sdgs' />
        <MobileNav activeTab='filter.entity.sdgs' />
        <PageContent
          filter={<SDGFilter />}
          content={<SDGListQuery />}
          searchFilter={
            <SearchFilter
              {...{ search, setSearch }}
              createNew={false}
              hint='filter.entity.sdgs'
            />
          }
          activeFilter={<SDGActiveFilter />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default SDGs
