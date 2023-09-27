import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import SectorRibbon from '../../components/sector/SectorRibbon'
import SectorTabNav from '../../components/sector/SectorTabNav'
import SectorMain from '../../components/sector/SectorMain'

const SectorListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.sector.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.sector.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <SectorRibbon />
          <SectorTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <SectorMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default SectorListPage
