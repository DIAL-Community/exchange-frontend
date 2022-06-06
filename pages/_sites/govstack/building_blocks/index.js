import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GradientBackground from '../../../../components/shared/GradientBackground'
import QueryNotification from '../../../../components/shared/QueryNotification'
import PageContent from '../../../../components/main/PageContent'
import BuildingBlockHint from '../../../../components/filter/hint/BuildingBlockHint'
import BuildingBlockFilter from '../../../../components/building-blocks/BuildingBlockFilter'
import BuildingBlockActiveFilter from '../../../../components/building-blocks/BuildingBlockActiveFilter'
import SearchFilter from '../../../../components/shared/SearchFilter'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext } from '../../../../components/context/BuildingBlockFilterContext'
import ClientOnly from '../../../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })
const BuildingBlockListQuery = dynamic(() => import('../../../../components/building-blocks/BuildingBlockList'), { ssr: false })

const BuildingBlocks = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.buildingBlocks'
          filter={<BuildingBlockFilter />}
          content={<BuildingBlockListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.buildingBlocks' />}
          activeFilter={<BuildingBlockActiveFilter />}
          hint={<BuildingBlockHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default BuildingBlocks