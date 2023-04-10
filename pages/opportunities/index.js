import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OpportunityListQuery from '../../components/opportunities/OpportunityList'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import TabNav from '../../components/main/TabNav'
import PageContent from '../../components/main/PageContent'
import OpportunityFilter from '../../components/opportunities/OpportunityFilter'
import OpportunityActiveFilter from '../../components/opportunities/OpportunityActiveFilter'
import SearchFilter from '../../components/shared/SearchFilter'
import { OpportunityFilterContext, OpportunityFilterDispatchContext }
  from '../../components/context/OpportunityFilterContext'
import MobileNav from '../../components/main/MobileNav'
import ClientOnly from '../../lib/ClientOnly'

const Opportunities = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(OpportunityFilterContext)
  const { setSearch } = useContext(OpportunityFilterDispatchContext)

  return (
    <>
      <NextSeo
        title={format('opportunity.header')}
        description={
          format(
            'shared.metadata.description.comprehensiveListOf',
            { entities: format('opportunity.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        <TabNav activeTab='filter.entity.opportunities' />
        <MobileNav activeTab='filter.entity.opportunities' />
        <PageContent
          activeTab='filter.entity.opportunities'
          filter={<OpportunityFilter />}
          content={<OpportunityListQuery />}
          searchFilter={
            <SearchFilter
              {...{ search, setSearch }}
              hint='filter.entity.opportunities'
            />
          }
          activeFilter={<OpportunityActiveFilter />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Opportunities
