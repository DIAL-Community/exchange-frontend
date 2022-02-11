import Head from 'next/head'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'

import TabNav from '../../components/main/TabNav'
import MobileNav from '../../components/main/MobileNav'
import PageContent from '../../components/main/PageContent'

import SDGHint from '../../components/filter/hint/SDGHint'

import SDGFilter from '../../components/sdgs/SDGFilter'
import SDGActiveFilter from '../../components/sdgs/SDGActiveFilter'
import SDGListQuery from '../../components/sdgs/SDGList'

import SearchFilter from '../../components/shared/SearchFilter'
import { SDGFilterContext, SDGFilterDispatchContext } from '../../components/context/SDGFilterContext'

import dynamic from 'next/dynamic'
import { useContext } from 'react'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const SDGs = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { search } = useContext(SDGFilterContext)
  const { setSearch } = useContext(SDGFilterDispatchContext)

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
      <TabNav activeTab='filter.entity.sdgs' />
      <MobileNav activeTab='filter.entity.sdgs' />
      <PageContent
        activeTab='filter.entity.products'
        filter={<SDGFilter />}
        content={<SDGListQuery />}
        searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.sdgs' />}
        activeFilter={<SDGActiveFilter />}
        hint={<SDGHint />}
      />
      <Footer />
    </>
  )
}

export default apolloClient()(SDGs)
