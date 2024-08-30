import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import HealthBody from '../../components/health/sections/HealthBody'
import HealthFooter from '../../components/health/sections/HealthFooter'
import HealthHeader from '../../components/health/sections/HealthHeader'
import HealthProducts from '../../components/health/sections/HealthProducts'
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
        <HealthHeader />
        <HealthBody />
        <HealthProducts />
        <HealthFooter />
      </ClientOnly>
    </>
  )
}

export default HealthPage
