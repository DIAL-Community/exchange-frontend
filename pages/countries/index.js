import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import CountryRibbon from '../../ui/v1/country/CountryRibbon'
import CountryTabNav from '../../ui/v1/country/CountryTabNav'
import CountryMain from '../../ui/v1/country/CountryMain'

const CountryListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.country.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.country.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <CountryRibbon />
          <CountryTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <CountryMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CountryListPage
