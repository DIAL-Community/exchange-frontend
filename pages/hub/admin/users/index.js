import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import HubAdminUsers from '../../../../components/hub/admin/HubAdminUsers'
import { allowedToView } from '../../../../components/hub/admin/utilities'
import HubFooter from '../../../../components/hub/sections/HubFooter'
import HubHeader from '../../../../components/hub/sections/HubHeader'
import QueryNotification from '../../../../components/shared/QueryNotification'
import { handleLoadingSession, handleSessionError } from '../../../../components/shared/SessionQueryHandler'
import ClientOnly from '../../../../lib/ClientOnly'

const HubAdminUserListPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { status, data } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn()
    }
  }, [status])

  return (
    <>
      <NextSeo
        title={format('hub.admin.users')}
        description={format('hub.landing.main.subtitle')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <HubHeader />
        { status === 'unauthenticated' || status === 'loading'
          ? handleLoadingSession()
          : status === 'authenticated' && allowedToView(data.user)
            ? <HubAdminUsers />
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

export default HubAdminUserListPage
