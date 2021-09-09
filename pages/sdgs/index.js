import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SDGListQuery from '../../components/sdgs/SDGList'
import { SDGFilterContext, SDGFilterDispatchContext } from '../../components/context/SDGFilterContext'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import SearchFilter from '../../components/shared/SearchFilter'

import dynamic from 'next/dynamic'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const SDGs = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

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
      <Filter activeTab='filter.entity.sdgs' />
      <SearchFilter {...{ search, setSearch }} placeholder={format('app.search') + format('sdg.label')} />
      <SDGListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(SDGs)
