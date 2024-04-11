import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import DpiFooter from '../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../components/dpi/sections/DpiHeader'
import DpiResources from '../../components/dpi/sections/DpiResources'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

const DpiPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={['dpi']}>
        <QueryNotification />
        <DpiHeader />
        <DpiResources />
        <DpiFooter />
      </ClientOnly>
    </>
  )
}

export default DpiPage
