import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import HubAdminContactForm from '../../../../../components/hub/admin/HubAdminContactForm'
import { allowedToView } from '../../../../../components/hub/admin/utilities'
import HubFooter from '../../../../../components/hub/sections/HubFooter'
import HubHeader from '../../../../../components/hub/sections/HubHeader'
import { SIMPLE_USER_DETAIL_QUERY } from '../../../../../components/shared/query/user'
import QueryNotification from '../../../../../components/shared/QueryNotification'
import { handleLoadingSession, handleSessionError } from '../../../../../components/shared/SessionQueryHandler'
import ClientOnly from '../../../../../lib/ClientOnly'

const HubAdminEditContactPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { status, data } = useSession()
  const { query: { userId } } = useRouter()

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
            ? <UserLoader userId={userId} />
            : handleSessionError()
        }
        <HubFooter />
      </ClientOnly>
    </>
  )
}

const UserLoader = ({ userId }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, data, error } = useQuery(SIMPLE_USER_DETAIL_QUERY, {
    variables: { userId }
  })

  return (
    <>
      {loading
        ? format('general.fetchingData')
        : error
          ? format('general.fetchError')
          : userId && data
            ? <HubAdminContactForm userId={userId} userEmail={data?.user.email} />
            : format('app.notFound')
      }
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { dpiTenants } = await response.json()

  // Passing data to the page as props
  return { props: { dpiTenants } }
}

export default HubAdminEditContactPage
