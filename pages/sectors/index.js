import { useContext, useState } from 'react'
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
import SectorForm from '../../components/sectors/SectorForm'
import PageContent from '../../components/main/PageContent'
const SectorListQuery = dynamic(() => import('../../components/sectors/SectorList'), { ssr: false })

const Sectors = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  const { search } = useContext(UserFilterContext)
  const { setSearch } = useContext(UserFilterDispatchContext)

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const toggleFormDialog = () => setIsFormDialogOpen(!isFormDialogOpen)

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        {loadingUserSession ? <Loading /> : isAdminUser ? (
          <>
            <PageContent
              content={<SectorListQuery />}
              searchFilter={
                <SearchFilter
                  search={search}
                  setSearch={setSearch}
                  hint='filter.entity.sectors'
                  onCreateNewClick={toggleFormDialog}
                  switchView={false}
                  exportJson={false}
                  exportCsv={false}
                />
              }
            />
            <SectorForm isOpen={isFormDialogOpen} onClose={toggleFormDialog} />
          </>
        ) : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Sectors
