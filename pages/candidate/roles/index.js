import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import SearchFilter from '../../../components/shared/SearchFilter'
import { RoleFilterContext, RoleFilterDispatchContext }
  from '../../../components/context/candidate/RoleFilterContext'
import MobileNav from '../../../components/main/MobileNav'
import PageContent from '../../../components/main/PageContent'
import TabNav from '../../../components/main/TabNav'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'
import { useUser } from '../../../lib/hooks'
const RoleListQuery = dynamic(() =>
  import('../../../components/candidate/roles/RoleList'), { ssr: false })
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const Roles = () => {
  const { search } = useContext(RoleFilterContext)
  const { setSearch } = useContext(RoleFilterDispatchContext)

  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <QueryNotification />
      <GradientBackground />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <Header />
      {loadingUserSession ? <Loading /> : isAdminUser ? (
        <ClientOnly>
          <TabNav activeTab='filter.entity.candidateRoles' />
          <MobileNav activeTab='filter.entity.candidateRoles' />
          <PageContent
            content={<RoleListQuery />}
            searchFilter={
              <SearchFilter
                {...{ search, setSearch }}
                hint='filter.entity.candidateRoles'
              />
            }
          />
        </ClientOnly>
      ) : <Unauthorized />}
      <Footer />
    </>
  )
}

export default Roles
