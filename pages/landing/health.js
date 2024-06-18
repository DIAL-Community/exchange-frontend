import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import DpiBody from '../../components/dpi/sections/DpiBody'
import DpiFooter from '../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../components/dpi/sections/DpiHeader'
import DpiResources from '../../components/dpi/sections/DpiResources'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

const HealthPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <DpiHeader />
        <DpiBody />
        <DpiResources />
        <DpiFooter />
      </ClientOnly>
    </>
  )
}

export default HealthPage
