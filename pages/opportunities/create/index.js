import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../components/shared/Footer'
import OpportunityCreate from '../../../components/opportunity/OpportunityCreate'

const CreateOpportunityPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <OpportunityCreate />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreateOpportunityPage
