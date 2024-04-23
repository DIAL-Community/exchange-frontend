import { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import HeroCarousel from '../../components/shared/HeroCarousel'
import MarketplaceDefinition from '../../components/shared/MarketplaceDefinition'
import Overview from '../../components/shared/Overview'
import QueryNotification from '../../components/shared/QueryNotification'
import ToolDefinition from '../../components/shared/ToolDefinition'
import WizardDefinition from '../../components/shared/WizardDefinition'
import ClientOnly from '../../lib/ClientOnly'
import { OVERVIEW_INTRO_KEY, OVERVIEW_INTRO_STEPS } from '../../lib/intro'

const LandingPage = ({ defaultTenants }) => {
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
      <ClientOnly clientTenants={defaultTenants}>
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

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default LandingPage
