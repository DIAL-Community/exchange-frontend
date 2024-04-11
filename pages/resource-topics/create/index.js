import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ResourceTopicCreate from '../../../components/resource-topic/ResourceTopicCreate'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'

const CreateResourceTopicPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ResourceTopicCreate />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreateResourceTopicPage
