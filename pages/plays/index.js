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

import { useContext } from 'react'
import dynamic from 'next/dynamic'

import { PlayFilterContext, PlayFilterDispatchContext } from '../../components/context/PlayFilterContext'
import { PlayListProvider } from '../../components/plays/PlayListContext'
import { PlayPreviewProvider } from '../../components/plays/PlayPreviewContext'
const PlayListQuery = dynamic(() => import('../../components/plays/PlayList'), { ssr: false })

const Products = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search } = useContext(PlayFilterContext)
  const { setSearch } = useContext(PlayFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <TabNav activeTab='filter.entity.plays' />
      <MobileNav activeTab='filter.entity.plays' />
      <PlayListProvider>
        <PlayPreviewProvider>
          <PageContent
            activeTab='filter.entity.plays'
            content={<PlayListQuery />}
            searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.plays' />}
          />
        </PlayPreviewProvider>
      </PlayListProvider>
      <Footer />
    </>
  )
}

export default apolloClient()(Products)
