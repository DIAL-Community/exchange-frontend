import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import HubBody from '../../components/hub/sections/HubBody'
import HubFooter from '../../components/hub/sections/HubFooter'
import HubHeader from '../../components/hub/sections/HubHeader'
import HubResources from '../../components/hub/sections/HubResources'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

const HubPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('hub.landing.main.title')}
        description={format('hub.landing.main.subtitle')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <HubHeader />
        <HubBody />
        <HubResources />
        <HubFooter />
      </ClientOnly>
    </>
  )
}

export default HubPage
