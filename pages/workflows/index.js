import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WorkflowListQuery from '../../components/workflows/WorkflowList'
import { WorkflowFilterContext, WorkflowFilterDispatchContext } from '../../components/context/WorkflowFilterContext'
import GradientBackground from '../../components/shared/GradientBackground'
import SearchFilter from '../../components/shared/SearchFilter'

const Workflows = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search, displayType } = useContext(WorkflowFilterContext)
  const { setSearch, setDisplayType } = useContext(WorkflowFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GradientBackground />
      <Header />
      <Filter activeTab='workflows' />
      <SearchFilter {...{ search, setSearch, displayType, setDisplayType }} componentName='Workflow' />
      <WorkflowListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(Workflows)
