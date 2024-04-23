import { useCallback, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ResourceFooter from '../../components/resources/ResourceFooter'
import ResourceHeader from '../../components/resources/ResourceHeader'
import ResourceMain from '../../components/resources/ResourceMain'
import ResourceRibbon from '../../components/resources/ResourceRibbon'
import ResourceTabNav from '../../components/resources/ResourceTabNav'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

const ResourceListPage = ({ defaultTenants }) => {
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
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <ResourceHeader />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <ResourceRibbon />
          <ResourceTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <ResourceMain activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <ResourceFooter />
      </ClientOnly>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default ResourceListPage
