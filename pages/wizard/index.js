import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import ClientOnly from '../../lib/ClientOnly'
import Footer from '../../ui/v1/shared/Footer'
import Header from '../../ui/v1/shared/Header'
import WizardMain from '../../ui/v1/wizard/WizardMain'
import { WizardContextProvider } from '../../ui/v1/wizard/WizardContext'

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
      <ClientOnly>
        <WizardContextProvider>
          <WizardMain />
        </WizardContextProvider>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Wizard
