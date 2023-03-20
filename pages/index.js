import { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import cookie from 'react-cookies'
import Header from '../components/Header'
import CatalogTitle from '../components/CatalogTitle'
import Footer from '../components/Footer'
import TabNav from '../components/main/TabNav'
import MobileNav from '../components/main/MobileNav'
import PageContent from '../components/main/PageContent'
import ProductHint from '../components/filter/hint/ProductHint'
import ProductFilter from '../components/products/ProductFilter'
import ProductActiveFilter from '../components/products/ProductActiveFilter'
import ProductListQuery from '../components/products/ProductList'
import SearchFilter from '../components/shared/SearchFilter'
import { ProductFilterContext, ProductFilterDispatchContext } from '../components/context/ProductFilterContext'
import ClientOnly from '../lib/ClientOnly'
import Intro from '../components/Intro'
import QueryNotification from '../components/shared/QueryNotification'
import HeroSection from '../components/Hero'
import Wizard from '../components/wizard/Wizard'
import { OVERVIEW_INTRO_KEY, OVERVIEW_INTRO_STEPS } from '../lib/intro'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const HomePage = () => {
  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  const STEP_INDEX_START = 0
  const STEP_INDEX_END = OVERVIEW_INTRO_STEPS.length - 1

  const [enableIntro, setEnableIntro] = useState(false)
  useEffect(() => {
    const enableIntro = String(cookie.load(OVERVIEW_INTRO_KEY)) !== 'true'
    setEnableIntro(enableIntro)
  }, [setEnableIntro])

  return (
    <>
      <Header />
      <HeroSection />
      <Wizard />
      <CatalogTitle />
      <QueryNotification />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <TabNav activeTab='filter.entity.products' />
      <MobileNav activeTab='filter.entity.products' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.products'
          filter={<ProductFilter />}
          content={<ProductListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.products' />}
          activeFilter={<ProductActiveFilter />}
          hint={<ProductHint />}
        />
        <Intro
          enabled={enableIntro}
          steps={OVERVIEW_INTRO_STEPS}
          startIndex={STEP_INDEX_START}
          endIndex={STEP_INDEX_END}
          completedKey={OVERVIEW_INTRO_KEY}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default HomePage
