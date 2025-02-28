import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { allowedToBrowseAdliPages } from '../../../components/hub/admin/utilities'
import HubDashboardAdli from '../../../components/hub/sections/HubDashboardAdli'
import HubFooter from '../../../components/hub/sections/HubFooter'
import HubHeader from '../../../components/hub/sections/HubHeader'
import QueryNotification from '../../../components/shared/QueryNotification'
import { handleLoadingSession, handleSessionError } from '../../../components/shared/SessionQueryHandler'
import ClientOnly from '../../../lib/ClientOnly'

const HubDashboardPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn()
    }
  }, [status])

  return (
    <>
      <NextSeo
        title={format('hub.header.adliNetwork')}
        description={format('hub.adliNetwork.subtitle')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <HubHeader />
        { status === 'unauthenticated' || status === 'loading'
          ? handleLoadingSession()
          : status === 'authenticated' && allowedToBrowseAdliPages(data?.user)
            ? <HubDashboardAdli />
            : handleSessionError()
        }
        <HubFooter />
      </ClientOnly>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { dpiTenants } = await response.json()

  // Passing data to the page as props
  return { props: { dpiTenants } }
}

export default HubDashboardPage
