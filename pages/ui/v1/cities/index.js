import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../../../../ui/v1/shared/Header'
import Footer from '../../../../ui/v1/shared/Footer'
import CityRibbon from '../../../../ui/v1/city/CityRibbon'
import CityTabNav from '../../../../ui/v1/city/CityTabNav'
import CityMain from '../../../../ui/v1/city/CityMain'

const CityListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.city.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.city.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <CityRibbon />
          <CityTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <CityMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CityListPage
