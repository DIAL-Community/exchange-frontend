import Cookies from 'js-cookie'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import { useCallback, useEffect, useState } from 'react'
import ClientOnly from '../lib/ClientOnly'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import HeroCarousel from '../components/shared/HeroCarousel'
import ToolDefinition from '../components/shared/ToolDefinition'
import WizardDefinition from '../components/shared/WizardDefinition'
import MarketplaceDefinition from '../components/shared/MarketplaceDefinition'
import { OVERVIEW_INTRO_KEY, OVERVIEW_INTRO_STEPS } from '../lib/intro'
import Overview from '../components/shared/Overview'
import QueryNotification from '../components/shared/QueryNotification'

const LandingPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <div className='xl:min-h-screen'>
            <HeroCarousel />
            <div className='py-12'>
              <ToolDefinition />
            </div>
          </div>
          <WizardDefinition />
          <MarketplaceDefinition />
          <Overview
            enabled={enableIntro}
            steps={OVERVIEW_INTRO_STEPS}
            startIndex={STEP_INDEX_START}
            endIndex={STEP_INDEX_END}
            completedKey={OVERVIEW_INTRO_KEY}
          />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default LandingPage
