import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import OrganizationForm from '../../../components/candidate/organizations/OrganizationForm'
import ClientOnly from '../../../lib/ClientOnly'

const CreateOrganization = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <GradientBackground />
      <Header />
      <ClientOnly>
        <OrganizationForm />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateOrganization
