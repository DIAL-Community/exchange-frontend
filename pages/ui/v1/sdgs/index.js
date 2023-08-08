import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../../../../ui/v1/shared/Header'
import Footer from '../../../../ui/v1/shared/Footer'
import SdgRibbon from '../../../../ui/v1/sdg/SdgRibbon'
import SdgTabNav from '../../../../ui/v1/sdg/SdgTabNav'
import SdgMain from '../../../../ui/v1/sdg/SdgMain'

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
            { entities: format('sdg.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
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
