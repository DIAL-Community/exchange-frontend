import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import TabNav from '../../../components/main/TabNav'
import MobileNav from '../../../components/main/MobileNav'
import PageContent from '../../../components/main/PageContent'
import SearchFilter from '../../../components/shared/SearchFilter'
import { OrganizationFilterContext, OrganizationFilterDispatchContext }
  from '../../../components/context/candidate/OrganizationFilterContext'
import ClientOnly from '../../../lib/ClientOnly'
const OrganizationListQuery = dynamic(() =>
  import('../../../components/candidate/organizations/OrganizationList'), { ssr: false })
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Organizations = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { search } = useContext(OrganizationFilterContext)
  const { setSearch } = useContext(OrganizationFilterDispatchContext)

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
      <TabNav activeTab='filter.entity.candidateOrganizations' />
      <MobileNav activeTab='filter.entity.candidateOrganizations' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.candidateOrganizations'
          content={<OrganizationListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.candidateOrganizations' />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Organizations
