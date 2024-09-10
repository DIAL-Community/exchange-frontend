import { useCallback, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import HubFooter from '../../../components/hub/sections/HubFooter'
import HubHeader from '../../../components/hub/sections/HubHeader'
import { Loading } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'

const HubCurriculumPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  useEffect(() => {
    router.push('/hub/dashboard')
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
        <HubHeader />
        <Loading />
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

export default HubCurriculumPage
