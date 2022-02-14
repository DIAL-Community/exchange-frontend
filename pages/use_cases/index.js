import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'

import apolloClient from '../../lib/apolloClient'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'

import MobileNav from '../../components/main/MobileNav'
import TabNav from '../../components/main/TabNav'
import PageContent from '../../components/main/PageContent'

import UseCaseHint from '../../components/filter/hint/UseCaseHint'

import UseCaseFilter from '../../components/use-cases/UseCaseFilter'
import UseCaseActiveFilter from '../../components/use-cases/UseCaseActiveFilter'

import SearchFilter from '../../components/shared/SearchFilter'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../../components/context/UseCaseFilterContext'

import dynamic from 'next/dynamic'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })
const UseCaseListQuery = dynamic(() => import('../../components/use-cases/UseCaseList'), { ssr: false })

const UseCases = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { search } = useContext(UseCaseFilterContext)
  const { setSearch } = useContext(UseCaseFilterDispatchContext)

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
      <TabNav activeTab='filter.entity.useCases' />
      <MobileNav activeTab='filter.entity.useCases' />
      <PageContent
        activeTab='filter.entity.products'
        filter={<UseCaseFilter />}
        content={<UseCaseListQuery />}
        searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.useCases' />}
        activeFilter={<UseCaseActiveFilter />}
        hint={<UseCaseHint />}
      />
      <Footer />
    </>
  )
}

export default apolloClient()(UseCases)
