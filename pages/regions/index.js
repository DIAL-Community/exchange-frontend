import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import RegionRibbon from '../../components/region/RegionRibbon'
import RegionTabNav from '../../components/region/RegionTabNav'
import RegionMain from '../../components/region/RegionMain'

const RegionListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.region.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.region.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <RegionRibbon />
          <RegionTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <RegionMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default RegionListPage
