import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
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
import ClientOnly from '../../lib/ClientOnly'

const Organizations = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(OrganizationFilterContext)
  const { setSearch } = useContext(OrganizationFilterDispatchContext)

  return (
    <>
      <NextSeo
        title={format('organization.header')}
        description={format('shared.metadata.description.comprehensiveListOf', { entities: format('organization.header')?.toLocaleLowerCase() })}
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <TabNav activeTab='filter.entity.organizations' />
      <MobileNav activeTab='filter.entity.organizations' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.organizations'
          filter={<OrganizationFilter />}
          content={<OrganizationListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.organizations' />}
          activeFilter={<OrganizationActiveFilter />}
          hint={<OrganizationHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Organizations
