import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import ClientOnly from '../../lib/ClientOnly'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import WizardMain from '../../components/wizard/WizardMain'
import { WizardContextProvider } from '../../components/wizard/WizardContext'

const Wizard = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <Header />
      <ClientOnly clientTenants={defaultTenants}>
        <WizardContextProvider>
          <WizardMain />
        </WizardContextProvider>
      </ClientOnly>
      <Footer />
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default Wizard
