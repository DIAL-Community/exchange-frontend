import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import SearchFilter from '../../components/shared/SearchFilter'
import { UserFilterContext, UserFilterDispatchContext } from '../../components/context/UserFilterContext'
import { Loading, Unauthorized } from '../../ui/v1/shared/FetchStatus'
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
          <div className='px-4 lg:px-8 xl:px-56'>
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
          </div>
        ) : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Users
