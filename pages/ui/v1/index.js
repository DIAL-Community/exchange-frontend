import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../components/shared/QueryNotification'
import Header from '../../../ui/v1/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../ui/v1/shared/Footer'
import HeroCarousel from '../../../ui/v1/shared/HeroCarousel'
import ToolDefinition from '../../../ui/v1/shared/ToolDefinition'
import WizardDefinition from '../../../ui/v1/shared/WizardDefinition'
import MarketplaceDefinition from '../../../ui/v1/shared/MarketplaceDefinition'

const LandingPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('use-case.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('use-case.header')?.toLocaleLowerCase() }
          )
        }
      />
      <QueryNotification />
      <Header />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <ClientOnly>
        <div className='flex flex-col'>
          <div className='xl:h-screen'>
            <HeroCarousel />
            <div className='py-12'>
              <ToolDefinition />
            </div>
          </div>
          <WizardDefinition />
          <MarketplaceDefinition />
        </div>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default LandingPage
