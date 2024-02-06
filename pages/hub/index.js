import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ResourceFooter from '../../components/hub/ResourceFooter'
import ResourceHeader from '../../components/hub/ResourceHeader'
import ResourceList from '../../components/hub/ResourceList'
import ResourceRibbon from '../../components/hub/ResourceRibbon'
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
        <div className='flex flex-col'>
          <ResourceRibbon />
          <ResourceList />
        </div>
        <ResourceFooter />
      </ClientOnly>
    </>
  )
}

export default ResourceListPage
