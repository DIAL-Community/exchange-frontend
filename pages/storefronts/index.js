import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import StorefrontRibbon from '../../ui/v1/storefront/StorefrontRibbon'
import StorefrontTabNav from '../../ui/v1/storefront/StorefrontTabNav'
import StorefrontMain from '../../ui/v1/storefront/StorefrontMain'

const StorefrontListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.storefront.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.storefront.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <StorefrontRibbon />
          <StorefrontTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <StorefrontMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default StorefrontListPage
