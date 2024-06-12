import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import DpiAdminContactForm from '../../../../components/dpi/admin/DpiAdminContactForm'
import { allowedToView } from '../../../../components/dpi/admin/utilities'
import DpiFooter from '../../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../../components/dpi/sections/DpiHeader'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import { SIMPLE_USER_DETAIL_QUERY } from '../../../../components/shared/query/user'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'

const DpiAdminEditContactPage = ({ dpiTenants }) => {
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
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <DpiHeader />
        { status === 'unauthenticated' || status === 'loading'
          ? <Loading />
          : status === 'authenticated' && allowedToView(data.user)
            ? <UserLoader userId={userId} />
            : <Unauthorized />
        }
        <DpiFooter />
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
            ? <DpiAdminContactForm userId={userId} userEmail={data?.user.email} />
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

export default DpiAdminEditContactPage
