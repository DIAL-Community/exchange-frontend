import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import ClientOnly from '../../../../lib/ClientOnly'
import QueryNotification from '../../../../components/shared/QueryNotification'
import HubEventDetail from '../../../../components/hub/sections/HubEventDetail'
import { Loading } from '../../../../components/shared/FetchStatus'
import HubHeader from '../../../../components/hub/sections/HubHeader'
import HubFooter from '../../../../components/hub/sections/HubFooter'

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
        title={format('app.title')}
        description={format('seo.description.about')}
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
