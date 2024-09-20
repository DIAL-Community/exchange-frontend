import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'
import RoleTabNav from '../../../../components/candidate/role/RoleTabNav'
import RoleMain from '../../../../components/health/candidate/role/RoleMain'
import HealthHeader from '../../../../components/health/sections/HealthHeader'
import HealthFooter from '../../../../components/health/sections/HealthFooter'
import RoleRibbon from '../../../../components/health/candidate/role/RoleRibbon'

const RoleListPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.candidateRole.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.candidateRole.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <HealthHeader />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <RoleRibbon />
          <RoleTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <RoleMain activeTab={activeTab} />
        </div>
        <HealthFooter />
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

export default RoleListPage
