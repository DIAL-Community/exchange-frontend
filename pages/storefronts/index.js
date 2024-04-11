import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import StorefrontRibbon from '../../components/storefront/StorefrontRibbon'
import StorefrontTabNav from '../../components/storefront/StorefrontTabNav'
import StorefrontMain from '../../components/storefront/StorefrontMain'

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
      <ClientOnly clientTenants={['default', 'fao']}>
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
