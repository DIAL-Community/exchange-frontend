import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import DpiFooter from '../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../components/dpi/sections/DpiHeader'
import DpiTopic from '../../../components/dpi/sections/DpiTopic'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'

const DpiTopicPage = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly>
        <QueryNotification />
        <DpiHeader />
        <DpiTopic />
        <DpiFooter />
      </ClientOnly>
    </>
  )
}

export default DpiTopicPage
