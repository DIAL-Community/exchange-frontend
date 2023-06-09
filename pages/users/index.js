import { useContext } from 'react'
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
import PageContent from '../../components/main/PageContent'
const UserListQuery = dynamic(() => import('../../components/users/UserList'), { ssr: false })

const Users = () => {
  const { search } = useContext(UserFilterContext)
  const { setSearch } = useContext(UserFilterDispatchContext)

  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        {loadingUserSession ? <Loading /> : isAdminUser ? (
          <>
            <PageContent
              content={<UserListQuery displayType='list' />}
              searchFilter={
                <SearchFilter
                  search={search}
                  setSearch={setSearch}
                  hint='filter.entity.users'
                  switchView={false}
                  exportJson={false}
                  exportCsv={false}
                />
              }
            />
          </>
        ) : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Users
