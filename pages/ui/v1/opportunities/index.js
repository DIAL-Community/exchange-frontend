import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../../../../ui/v1/shared/Header'
import Footer from '../../../../ui/v1/shared/Footer'
import OpportunityRibbon from '../../../../ui/v1/opportunity/OpportunityRibbon'
import OpportunityTabNav from '../../../../ui/v1/opportunity/OpportunityTabNav'
import OpportunityMain from '../../../../ui/v1/opportunity/OpportunityMain'

const OpportunityListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.opportunity.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.opportunity.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <OpportunityRibbon />
          <OpportunityTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <OpportunityMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default OpportunityListPage
