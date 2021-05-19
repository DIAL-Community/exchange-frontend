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
import GradientBackground from '../../components/shared/GradientBackground'

const BuildingBlocks = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search, displayType } = useContext(BuildingBlockFilterContext)
  const { setSearch, setDisplayType } = useContext(BuildingBlockFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <GradientBackground />
      <Header />
      <Filter activeTab='building_blocks' />
      <SearchFilter {...{ search, setSearch, displayType, setDisplayType }} placeholder='Search for a Building Block' />
      <BuildingBlockListQuery />
      <Footer />
    </>
  )
}

export default apolloClient()(BuildingBlocks)
