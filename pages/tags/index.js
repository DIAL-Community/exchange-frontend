import { useContext, useState } from 'react'
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
import TagForm from '../../components/tags/TagForm'
const TagsListQuery = dynamic(() => import('../../components/tags/TagList'), { ssr: false })

const Tags = () => {
  const [session] = useSession()
  const { isAdminUser, loadingUserSession } = useUser(session)

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
            <SearchFilter
              search={search}
              setSearch={setSearch}
              onCreateNewClick={toggleFormDialog}
              hint='filter.entity.tags'
              switchView={false}
              exportJson={false}
              exportCsv={false}
            />
            <TagsListQuery />
            <TagForm isOpen={isFormDialogOpen} onClose={toggleFormDialog} />
          </>
        ) : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Tags
