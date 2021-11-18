import Head from 'next/head'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SearchFilter from '../../components/shared/SearchFilter'
import GradientBackground from '../../components/shared/GradientBackground'
import QueryNotification from '../../components/shared/QueryNotification'

import { useContext } from 'react'
import dynamic from 'next/dynamic'

import { PlayFilterContext, PlayFilterDispatchContext } from '../../components/context/PlayFilterContext'
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
      <Filter activeTab='filter.entity.products' />
      <SearchFilter {...{ search, setSearch }} placeholder={format('app.search') + format('plays.label')} />
      <PlayListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(Products)
