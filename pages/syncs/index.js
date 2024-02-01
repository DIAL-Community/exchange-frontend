import { useCallback, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import SyncMain from '../../components/sync/SyncMain'
import SyncRibbon from '../../components/sync/SyncRibbon'
import SyncTabNav from '../../components/sync/SyncTabNav'
import ClientOnly from '../../lib/ClientOnly'

const SyncListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.sync.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.sync.header')?.toLocaleLowerCase() }
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
