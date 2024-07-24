import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import HubEventDetail from '../../../../components/hub/sections/HubEventDetail'
import HubFooter from '../../../../components/hub/sections/HubFooter'
import HubHeader from '../../../../components/hub/sections/HubHeader'
import { Loading } from '../../../../components/shared/FetchStatus'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'

const HubEventPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug } } = useRouter()

  const { status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn()
    }
  }, [status])

  return (
    <>
      <NextSeo
        title={format('hub.event.label')}
        description={format('hub.expertNetwork.subtitle')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <HubHeader />
        { (status === 'unauthenticated' || status === 'loading') && <Loading />}
        { status === 'authenticated' && <HubEventDetail slug={slug} />}
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

export default HubEventPage
