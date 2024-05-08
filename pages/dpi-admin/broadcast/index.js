import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import DpiAdminBroadcast from '../../../components/dpi/admin/DpiAdminBroadcast'
import DpiFooter from '../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../components/dpi/sections/DpiHeader'
import { Unauthorized } from '../../../components/shared/FetchStatus'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'

const DpiAdminUserPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

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
        <DpiHeader />
        { status === 'unauthenticated' && <Unauthorized />}
        { status === 'authenticated' && <DpiAdminBroadcast />}
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

export default DpiAdminUserPage
