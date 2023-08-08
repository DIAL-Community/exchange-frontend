import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../../../../ui/v1/shared/Header'
import Footer from '../../../../ui/v1/shared/Footer'
import OrganizationRibbon from '../../../../ui/v1/organization/OrganizationRibbon'
import OrganizationTabNav from '../../../../ui/v1/organization/OrganizationTabNav'
import OrganizationMain from '../../../../ui/v1/organization/OrganizationMain'

const OrganizationListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.organization.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.organization.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <OrganizationRibbon />
          <OrganizationTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <OrganizationMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default OrganizationListPage
