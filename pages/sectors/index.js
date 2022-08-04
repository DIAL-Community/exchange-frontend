import { useContext } from 'react'
import { useSession } from 'next-auth/client'
import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import SearchFilter from '../../components/shared/SearchFilter'
import { UserFilterContext, UserFilterDispatchContext } from '../../components/context/UserFilterContext'
import { Loading, Unauthorized } from '../../components/shared/FetchStatus'
import ClientOnly from '../../lib/ClientOnly'
import { useUser } from '../../lib/hooks'
const SectorListQuery = dynamic(() => import('../../components/sectors/SectorList'), { ssr: false })

const Sectors = () => {
  const [session] = useSession()
  const { isAdminUser, loadingUserSession } = useUser(session)

  const { search } = useContext(UserFilterContext)
  const { setSearch } = useContext(UserFilterDispatchContext)

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        {loadingUserSession ? <Loading /> : isAdminUser ? (
          <>
            <SearchFilter
              search={search}
              setSearch={setSearch}
              hint='filter.entity.sectors'
              switchView={false}
              exportJson={false}
              exportCsv={false}
            />
            <SectorListQuery />
          </>
        ) : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Sectors
