import Head from 'next/head'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import apolloClient from '../../lib/apolloClient'

import Filter from '../../components/filter/Filter'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BuildingBlockListQuery from '../../components/building-blocks/BuildingBlockList'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext } from '../../components/context/BuildingBlockFilterContext'
import SearchFilter from '../../components/shared/SearchFilter'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'

import dynamic from 'next/dynamic'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const BuildingBlocks = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search } = useContext(BuildingBlockFilterContext)
  const { setSearch } = useContext(BuildingBlockFilterDispatchContext)

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
      <Filter activeTab='filter.entity.buildingBlocks' />
      <SearchFilter {...{ search, setSearch }} placeholder={format('app.search') + format('building-block.label')} />
      <BuildingBlockListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(BuildingBlocks)
