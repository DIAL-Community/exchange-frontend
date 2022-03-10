import Head from 'next/head'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import GradientBackground from '../../components/shared/GradientBackground'
import QueryNotification from '../../components/shared/QueryNotification'

import MobileNav from '../../components/main/MobileNav'
import TabNav from '../../components/main/TabNav'
import PageContent from '../../components/main/PageContent'
import SearchFilter from '../../components/shared/SearchFilter'

import PlaybookFilter from '../../components/playbooks/PlaybookFilter'
import PlaybookActiveFilter from '../../components/playbooks/PlaybookActiveFilter'
import PlaybookHint from '../../components/filter/hint/PlaybookHint'

import { useContext } from 'react'
import dynamic from 'next/dynamic'

import { PlaybookFilterContext, PlaybookFilterDispatchContext } from '../../components/context/PlaybookFilterContext'
const PlaybookListQuery = dynamic(() => import('../../components/playbooks/PlaybookList'), { ssr: false })

const Playbooks = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search } = useContext(PlaybookFilterContext)
  const { setSearch } = useContext(PlaybookFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <TabNav activeTab='filter.entity.playbooks' />
      <MobileNav activeTab='filter.entity.playbooks' />
      <PageContent
        activeTab='filter.entity.playbooks'
        filter={<PlaybookFilter />}
        content={<PlaybookListQuery />}
        searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.playbooks' />}
        activeFilter={<PlaybookActiveFilter />}
        hint={<PlaybookHint />}
      />
      <Footer />
    </>
  )
}

export default apolloClient()(Playbooks)
