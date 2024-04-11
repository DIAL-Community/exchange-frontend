import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import DpiCountry from '../../../components/dpi/sections/DpiCountry'
import DpiFooter from '../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../components/dpi/sections/DpiHeader'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'

const DpiCountryPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const { query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={['dpi']}>
        <QueryNotification />
        <DpiHeader />
        <DpiCountry slug={slug} />
        <DpiFooter />
      </ClientOnly>
    </>
  )
}

export default DpiCountryPage
