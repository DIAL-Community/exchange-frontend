import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import DpiAdminMessageForm from '../../../../components/dpi/admin/DpiAdminMessageForm'
import DpiFooter from '../../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../../components/dpi/sections/DpiHeader'
import { Loading } from '../../../../components/shared/FetchStatus'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'

const DpiAdminBroadcastPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { status } = useSession()
  const { query: { messageSlug } } = useRouter()

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
        <DpiHeader />
        { status === 'unauthenticated' && <Loading />}
        { status === 'authenticated' && <DpiAdminMessageForm messageSlug={messageSlug} />}
        <DpiFooter />
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

export default DpiAdminBroadcastPage
