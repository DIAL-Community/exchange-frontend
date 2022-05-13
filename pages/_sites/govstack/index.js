import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import PageContent from '../../../components/main/PageContent'
import ProductHint from '../../../components/filter/hint/ProductHint'
import BuildingBlockFilter from '../../../components/building-blocks/BuildingBlockFilter'
import BuildingBlockActiveFilter from '../../../components/building-blocks/BuildingBlockActiveFilter'
import BuildingBlockListQuery from '../../../components/building-blocks/BuildingBlockList'
import SearchFilter from '../../../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../../components/context/ProductFilterContext'
import ClientOnly from '../../../lib/ClientOnly'
import Header from './components/Header'
import Landing from './components/Landing'
import Footer from './components/Footer'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const HomePage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <Landing />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.buildingBlocks'
          filter={<BuildingBlockFilter />}
          content={<BuildingBlockListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.buildingBlocks' />}
          activeFilter={<BuildingBlockActiveFilter />}
          hint={<ProductHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default HomePage
