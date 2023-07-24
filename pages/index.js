import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'
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
import { ProductFilterContext, ProductFilterDispatchContext }
  from '../components/context/ProductFilterContext'
import ClientOnly from '../lib/ClientOnly'
import Intro from '../components/Intro'
import QueryNotification from '../components/shared/QueryNotification'
import HeroSection from '../components/Hero'
import Wizard from '../components/wizard/Wizard'
import { OVERVIEW_INTRO_KEY, OVERVIEW_INTRO_STEPS } from '../lib/intro'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const HomePage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(ProductFilterContext)
  const { setSearch } = useContext(ProductFilterDispatchContext)

  const STEP_INDEX_START = 0
  const STEP_INDEX_END = OVERVIEW_INTRO_STEPS.length - 1

  const [enableIntro, setEnableIntro] = useState(false)
  useEffect(() => {
    const enableIntro = String(Cookies.get(OVERVIEW_INTRO_KEY)) !== 'true'
    setEnableIntro(enableIntro)
  }, [setEnableIntro])

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <Header />
      <HeroSection />
      <Wizard />
      <CatalogTitle />
      <QueryNotification />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <TabNav activeTab='filter.entity.products' />
      <MobileNav activeTab='filter.entity.products' />
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.products'
          filter={<ProductFilter />}
          mobileFilter={<ProductFilter inMobileView={true} />}
          content={<ProductListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.products' />}
          activeFilter={<ProductActiveFilter />}
          hint={<ProductHint />}
        />
        {!isMobile &&
          <Intro
            enabled={enableIntro}
            steps={OVERVIEW_INTRO_STEPS}
            startIndex={STEP_INDEX_START}
            endIndex={STEP_INDEX_END}
            completedKey={OVERVIEW_INTRO_KEY}
          />
        }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default HomePage
