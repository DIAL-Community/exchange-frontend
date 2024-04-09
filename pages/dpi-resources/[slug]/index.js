import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ResourceDetail from '../../../components/resources/ResourceDetail'
import DpiFooter from '../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../components/dpi/sections/DpiHeader'
import ClientOnly from '../../../lib/ClientOnly'

const ResourcePage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug } } = useRouter()

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
      <ClientOnly clientTenant='dpi'>
        <DpiHeader />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ResourceDetail slug={slug} />
        <DpiFooter />
      </ClientOnly>
    </>
  )
}

export default ResourcePage
