import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
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
const RoleListQuery = dynamic(() =>
  import('../../../components/candidate/roles/RoleList'), { ssr: false })
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Roles = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { search } = useContext(RoleFilterContext)
  const { setSearch } = useContext(RoleFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <Header />
      <TabNav activeTab='filter.entity.candidateRoles' />
      <MobileNav activeTab='filter.entity.candidateRoles' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.candidateProducts'
          content={<RoleListQuery displayType='list' />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.candidateRoles' />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Roles
