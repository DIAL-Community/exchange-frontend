import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import SyncRibbon from '../../components/sync/SyncRibbon'
import SyncTabNav from '../../components/sync/SyncTabNav'
import SyncMain from '../../components/sync/SyncMain'

const SyncListPage = () => {
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
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <SyncRibbon />
          <SyncTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <SyncMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default SyncListPage
