import { useIntl } from 'react-intl'
import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import AboutRibbon from '../../components/about/AboutRibbon'
import AboutMain from '../../components/about/AboutMain'

const AboutPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('header.about')}
        description={format('seo.description.about')}
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <div className='flex flex-col'>
          <AboutRibbon />
          <AboutMain />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default AboutPage
