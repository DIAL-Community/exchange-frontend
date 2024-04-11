import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import DpiCountries from '../../components/dpi/sections/DpiCountries'
import DpiFooter from '../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../components/dpi/sections/DpiHeader'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

const DpiCountriesPage = () => {
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
        <DpiCountries />
        <DpiFooter />
      </ClientOnly>
    </>
  )
}

export default DpiCountriesPage
