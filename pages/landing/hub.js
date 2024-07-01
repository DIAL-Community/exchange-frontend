import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import HubHeader from '../../components/hub/sections/HubHeader'
import HubBody from '../../components/hub/sections/HubBody'
import HubResources from '../../components/hub/sections/HubResources'
import HubFooter from '../../components/hub/sections/HubFooter'

const HubPage = ({ dpiTenants }) => {
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
        <HubBody />
        <HubResources />
        <HubFooter />
      </ClientOnly>
    </>
  )
}

export default HubPage
