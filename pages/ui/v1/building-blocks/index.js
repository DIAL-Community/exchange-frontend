import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../../../../ui/v1/shared/Header'
import Footer from '../../../../ui/v1/shared/Footer'
import BuildingBlockRibbon from '../../../../ui/v1/building-block/BuildingBlockRibbon'
import BuildingBlockTabNav from '../../../../ui/v1/building-block/BuildingBlockTabNav'
import BuildingBlockMain from '../../../../ui/v1/building-block/BuildingBlockMain'

const BuildingBlockListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.buildingBlock.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.buildingBlock.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <BuildingBlockRibbon />
          <BuildingBlockTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <BuildingBlockMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default BuildingBlockListPage
