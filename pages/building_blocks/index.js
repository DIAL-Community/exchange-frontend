import { useCallback, useContext } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import QueryNotification from '../../components/shared/QueryNotification'
import GradientBackground from '../../components/shared/GradientBackground'
import TabNav from '../../components/main/TabNav'
import MobileNav from '../../components/main/MobileNav'
import PageContent from '../../components/main/PageContent'
import BuildingBlockHint from '../../components/filter/hint/BuildingBlockHint'
import BuildingBlockFilter from '../../components/building-blocks/BuildingBlockFilter'
import BuildingBlockActiveFilter from '../../components/building-blocks/BuildingBlockActiveFilter'
import BuildingBlockListQuery from '../../components/building-blocks/BuildingBlockList'
import SearchFilter from '../../components/shared/SearchFilter'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext }
  from '../../components/context/BuildingBlockFilterContext'
import ClientOnly from '../../lib/ClientOnly'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const BuildingBlocks = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(BuildingBlockFilterContext)
  const { setSearch } = useContext(BuildingBlockFilterDispatchContext)

  return (
    <>
      <NextSeo
        title={format('building-block.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('building-block.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <TabNav activeTab='filter.entity.buildingBlocks' />
      <MobileNav activeTab='filter.entity.buildingBlocks' />
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
