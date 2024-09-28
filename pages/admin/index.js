import { useCallback, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Loading } from '../../components/shared/FetchStatus'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import ClientOnly from '../../lib/ClientOnly'

const AdminPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return (
    <>
      <NextSeo
        title={format('hub.curriculum.label')}
        description={format('hub.curriculum.title')}
      />
      <NextSeo
        title={format('hub.header.adliNetwork')}
        description={format('hub.adliNetwork.subtitle')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <Header />
        <Loading />
        <Footer />
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

export default AdminPage