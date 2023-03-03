/* eslint-disable max-len */
import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import PageContent from '../../../components/main/PageContent'
import ProductHint from '../../../components/filter/hint/ProductHint'
import UseCaseHint from '../../../components/filter/hint/UseCaseHint'
import BuildingBlockHint from '../../../components/filter/hint/BuildingBlockHint'
import ProductActiveFilter from '../../../components/products/ProductActiveFilter'
import UseCaseActiveFilter from '../../../components/use-cases/UseCaseActiveFilter'
import BuildingBlockActiveFilter from '../../../components/building-blocks/BuildingBlockActiveFilter'
import SearchFilter from '../../../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../../components/context/ProductFilterContext'
import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../../../components/context/UseCaseFilterContext'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext } from '../../../components/context/BuildingBlockFilterContext'
import ClientOnly from '../../../lib/ClientOnly'
import TabNav from './components/TabNav'

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })
const ProductListQuery = dynamic(() => import('../../../components/products/ProductList'), { ssr: false })
const UseCaseListQuery = dynamic(() => import('../../../components/use-cases/UseCaseList'), { ssr: false })
const BuildingBlockListQuery = dynamic(() => import('../../../components/building-blocks/BuildingBlockList'), { ssr: false })

const EmbedPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const router = useRouter()
  const [activeTab, setActiveTab] = useState()

  useEffect(() => {
    if (!router.isReady) return
    setActiveTab(router.query.activeTab)
  }, [router.isReady, router.query])

  const { useCaseSearch } = useContext(UseCaseFilterContext)
  const { setUseCaseSearch } = useContext(UseCaseFilterDispatchContext)
  const { productSearch } = useContext(ProductFilterContext)
  const { setProductSearch } = useContext(ProductFilterDispatchContext)
  const { buildingBlockSearch } = useContext(BuildingBlockFilterContext)
  const { setBuildingBlockSearch } = useContext(BuildingBlockFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='min-h-[72px]'></div>
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <div className='container'>
        <TabNav activeTab={activeTab === 'useCases' ? 'filter.entity.useCases' : activeTab === 'products' ? 'filter.entity.products' : 'filter.entity.buildingBlocks'} />
        <ClientOnly>
          <PageContent
            activeTab={activeTab === 'useCases' ? 'filter.entity.useCases' : activeTab === 'products' ? 'filter.entity.products' : 'filter.entity.buildingBlocks'}
            content={activeTab === 'useCases' ? <UseCaseListQuery /> : activeTab === 'products' ? <ProductListQuery /> : <BuildingBlockListQuery /> }
            searchFilter={activeTab === 'useCases' ? <SearchFilter {...{ search: useCaseSearch, setSearch: setUseCaseSearch }} hint='filter.entity.useCases' /> : activeTab === 'useCases' ? <SearchFilter {...{ search: productSearch, setSearch: setProductSearch }} hint='filter.entity.products' /> : <SearchFilter {...{ search: buildingBlockSearch, setSearch: setBuildingBlockSearch }} hint='filter.entity.buildingBlocks' /> }
            activeFilter={activeTab === 'useCases' ? <UseCaseActiveFilter /> : activeTab === 'products' ? <ProductActiveFilter /> : <BuildingBlockActiveFilter /> }
            hint={activeTab === 'useCases' ? <UseCaseHint /> : activeTab === 'products' ? <ProductHint /> : <BuildingBlockHint /> }
          />
        </ClientOnly>
      </div>
    </>
  )
}

export default EmbedPage
