import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import ClientOnly from '../../../lib/ClientOnly'
import QueryNotification from '../../../components/shared/QueryNotification'
import HubHeader from '../../../components/hub/sections/HubHeader'
import HubTopics from '../../../components/hub/sections/HubTopics'
import HubFooter from '../../../components/hub/sections/HubFooter'

const HubTopicsPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <HubHeader />
        <HubTopics />
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

export default HubTopicsPage
