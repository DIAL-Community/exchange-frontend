import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import PageContent from '../../components/main/PageContent'
import StorefrontFilter from '../../components/organizations/storefronts/StorefrontFilter'
import SearchFilter from '../../components/shared/SearchFilter'
import { OrganizationFilterContext, OrganizationFilterDispatchContext }
  from '../../components/context/OrganizationFilterContext'
import ClientOnly from '../../lib/ClientOnly'
import StorefrontListQuery from '../../components/organizations/storefronts/StorefrontList'
import StorefrontActiveFilter from '../../components/organizations/storefronts/StorefrontActiveFilter'

const Storefronts = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(OrganizationFilterContext)
  const { setSearch } = useContext(OrganizationFilterDispatchContext)

  return (
    <>
      <NextSeo
        title={format('organization.header')}
        description={
          format(
            'shared.metadata.description.comprehensiveListOf',
            { entities: format('organization.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.storefronts'
          filter={<StorefrontFilter />}
          content={<StorefrontListQuery />}
          searchFilter={
            <SearchFilter
              {...{ search, setSearch }}
              hint='filter.entity.storefronts'
              exportCsv={false}
              exportJson={false}
            />
          }
          activeFilter={<StorefrontActiveFilter />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Storefronts
