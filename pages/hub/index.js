import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import ResourceList from '../../components/dial/ResourceList'
import ResourceHeader from '../../components/dial/ResourceHeader'
import ResourceFooter from '../../components/dial/ResourceFooter'
import ResourceRibbon from '../../components/dial/ResourceRibbon'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

const ResourceListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
        <ResourceHeader />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col gap-y-12'>
          <ResourceRibbon />
          <ResourceList />
        </div>
        <ResourceFooter />
      </ClientOnly>
    </>
  )
}

export default ResourceListPage
