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
        <div className='px-4 xl:px-16 py-4 xl:py-8 bg-dial-alice-blue'>
          <div className='grid grid-cols-1 xl:grid-cols-7 gap-3 xl:gap-x-24 xl:gap-y-8'>
            <div className='xl:col-span-2 row-span-2'>
              <SDGFilter />
            </div>
            <div className='xl:col-span-5 my-auto'>
              <SearchFilter {...{ search, setSearch }} createNew={false} hint='filter.entity.sdgs' />
            </div>
            <div className='xl:col-span-5'>
              <SDGListQuery />
            </div>
          </div>
        </div>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default SDGs
