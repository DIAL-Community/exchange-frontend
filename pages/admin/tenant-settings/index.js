import { useCallback, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import QueryNotification from '../../../components/shared/QueryNotification'
import TenantSettingMain from '../../../components/tenant-setting/TenantSettingMain'
import TenantSettingRibbon from '../../../components/tenant-setting/TenantSettingRibbon'
import TenantSettingTabNav from '../../../components/tenant-setting/TenantSettingTabNav'
import ClientOnly from '../../../lib/ClientOnly'

const TenantSettingsPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.siteSetting.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.siteSetting.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <TenantSettingRibbon />
          <TenantSettingTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <TenantSettingMain activeTab={activeTab} />
        </div>
        <Footer />
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

export default TenantSettingsPage
