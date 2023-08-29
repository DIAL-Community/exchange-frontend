import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import ResourceRibbon from '../../ui/v1/resource/ResourceRibbon'
import ResourceTabNav from '../../ui/v1/resource/ResourceTabNav'
import ResourceMain from '../../ui/v1/resource/ResourceMain'

const ResourceListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.resource.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.resource.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <ResourceRibbon />
          <ResourceTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <ResourceMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ResourceListPage
