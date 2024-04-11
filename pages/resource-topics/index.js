import { useCallback, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ResourceTopicMain from '../../components/resource-topic/ResourceTopicMain'
import ResourceTopicRibbon from '../../components/resource-topic/ResourceTopicRibbon'
import ResourceTopicTabNav from '../../components/resource-topic/ResourceTopicTabNav'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

const ResourceTopicListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.resourceTopic.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.resourceTopic.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={['default', 'fao']}>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <ResourceTopicRibbon />
          <ResourceTopicTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <ResourceTopicMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ResourceTopicListPage
