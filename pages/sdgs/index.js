import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import SdgRibbon from '../../components/sdg/SdgRibbon'
import SdgTabNav from '../../components/sdg/SdgTabNav'
import SdgMain from '../../components/sdg/SdgMain'

const SdgListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.sdg.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.sdg.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenant='default'>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <SdgRibbon />
          <SdgTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <SdgMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default SdgListPage
