import { useCallback, useContext } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import MobileNav from '../../components/main/MobileNav'
import PageContent from '../../components/main/PageContent'
import TabNav from '../../components/main/TabNav'
import WorkflowFilter from '../../components/workflows/WorkflowFilter'
import WorkflowListQuery from '../../components/workflows/WorkflowList'
import WorkflowActiveFilter from '../../components/workflows/WorkflowActiveFilter'
import SearchFilter from '../../components/shared/SearchFilter'
import { WorkflowFilterContext, WorkflowFilterDispatchContext } from '../../components/context/WorkflowFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const Workflows = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(WorkflowFilterContext)
  const { setSearch } = useContext(WorkflowFilterDispatchContext)

  return (
    <>
      <NextSeo
        title={format('workflow.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('workflow.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <ClientOnly>
        <TabNav activeTab='filter.entity.workflows' />
        <MobileNav activeTab='filter.entity.workflows' />
        <PageContent
          activeTab='filter.entity.workflows'
          filter={<WorkflowFilter />}
          content={<WorkflowListQuery />}
          searchFilter={
            <SearchFilter
              {...{ search, setSearch }}
              hint='filter.entity.workflows'
            />
          }
          activeFilter={<WorkflowActiveFilter />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Workflows
