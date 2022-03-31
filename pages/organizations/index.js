import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import apolloClient from '../../lib/apolloClient'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrganizationListQuery from '../../components/organizations/OrganizationList'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import TabNav from '../../components/main/TabNav'
import PageContent from '../../components/main/PageContent'
import OrganizationFilter from '../../components/organizations/OrganizationFilter'
import OrganizationActiveFilter from '../../components/organizations/OrganizationActiveFilter'
import OrganizationHint from '../../components/filter/hint/OrganizationHint'
import SearchFilter from '../../components/shared/SearchFilter'
import { OrganizationFilterContext, OrganizationFilterDispatchContext } from '../../components/context/OrganizationFilterContext'
import MobileNav from '../../components/main/MobileNav'

const Organizations = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
      <Header />
      <TabNav activeTab='filter.entity.organizations' />
      <MobileNav activeTab='filter.entity.organizations' />
      <PageContent
        activeTab='filter.entity.products'
        filter={<OrganizationFilter />}
        content={<OrganizationListQuery />}
        searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.organizations' />}
        activeFilter={<OrganizationActiveFilter />}
        hint={<OrganizationHint />}
      />
      <Footer />
    </>
  )
}

export default apolloClient()(Organizations)
