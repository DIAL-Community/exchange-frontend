import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../lib/ClientOnly'
import QueryNotification from '../components/shared/QueryNotification'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import HeroCarousel from '../components/shared/HeroCarousel'
import ToolDefinition from '../components/shared/ToolDefinition'
import WizardDefinition from '../components/shared/WizardDefinition'
import MarketplaceDefinition from '../components/shared/MarketplaceDefinition'

const LandingPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default LandingPage
