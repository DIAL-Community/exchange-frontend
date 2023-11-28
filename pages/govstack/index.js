import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import { useCallback } from 'react'
import ClientOnly from '../../lib/ClientOnly'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import Carousel from '../../components/govstack/Carousel'
import Definition from '../../components/govstack/Definition'
import QueryNotification from '../../components/shared/QueryNotification'

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
            <Carousel />
            <div className='py-12'>
              <Definition />
            </div>
          </div>
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default LandingPage