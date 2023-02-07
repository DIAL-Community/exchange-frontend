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
import NavigationSelection from '../../components/NavigationSelect'

const SDGs = () => {
  const { search } = useContext(SDGFilterContext)
  const { setSearch } = useContext(SDGFilterDispatchContext)

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        <div className='grid grid-cols-7 gap-x-24 gap-y-8 bg-dial-alice-blue px-16 py-8'>
          <div className='col-span-2'>
            <NavigationSelection activeTab='filter.entity.sdgs' />
          </div>
          <div className='col-span-5 my-auto'>
            <SearchFilter {...{ search, setSearch }} createNew={false} hint='filter.entity.sdgs' />
          </div>
          <div className='col-span-2'>
            <SDGFilter />
          </div>
          <div className='col-span-5'>
            <SDGListQuery />
          </div>
        </div>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default SDGs
