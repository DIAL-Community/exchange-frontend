import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ResourceTopicDetail from '../../../components/resource-topic/ResourceTopicDetail'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'

const ResourceTopicPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug } } = useRouter()

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
      <ClientOnly clientTenant='default'>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ResourceTopicDetail slug={slug} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ResourceTopicPage
