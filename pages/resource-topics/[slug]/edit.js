import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ResourceTopicEdit from '../../../components/resource-topic/ResourceTopicEdit'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'

const EditResourceTopicPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug } } = useRouter()

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
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ResourceTopicEdit slug={slug} locale={locale} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default EditResourceTopicPage
