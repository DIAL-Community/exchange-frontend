import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import MobileNav from '../../components/main/MobileNav'
import PageContent from '../../components/main/PageContent'
import TabNav from '../../components/main/TabNav'
import WorkflowHint from '../../components/filter/hint/WorkflowHint'
import WorkflowFilter from '../../components/workflows/WorkflowFilter'
import WorkflowListQuery from '../../components/workflows/WorkflowList'
import WorkflowActiveFilter from '../../components/workflows/WorkflowActiveFilter'
import SearchFilter from '../../components/shared/SearchFilter'
import { WorkflowFilterContext, WorkflowFilterDispatchContext } from '../../components/context/WorkflowFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const Workflows = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { search } = useContext(WorkflowFilterContext)
  const { setSearch } = useContext(WorkflowFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <TabNav activeTab='filter.entity.workflows' />
      <MobileNav activeTab='filter.entity.workflows' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.products'
          filter={<WorkflowFilter />}
          content={<WorkflowListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.workflows' />}
          activeFilter={<WorkflowActiveFilter />}
          hint={<WorkflowHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Workflows
