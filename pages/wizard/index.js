import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import ClientOnly from '../../lib/ClientOnly'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import WizardMain from '../../components/wizard/WizardMain'
import { WizardContextProvider } from '../../components/wizard/WizardContext'

const Wizard = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <Header />
      <ClientOnly clientTenant='default'>
        <WizardContextProvider>
          <WizardMain />
        </WizardContextProvider>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Wizard
