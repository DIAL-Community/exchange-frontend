import { useCallback, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import QueryNotification from '../../../components/shared/QueryNotification'
import SiteSettingMain from '../../../components/site-setting/SiteSettingMain'
import SiteSettingRibbon from '../../../components/site-setting/SiteSettingRibbon'
import SiteSettingTabNav from '../../../components/site-setting/SiteSettingTabNav'
import ClientOnly from '../../../lib/ClientOnly'

const SiteSettingsPage = ({ defaultTenants }) => {
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
          <SiteSettingRibbon />
          <SiteSettingTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <SiteSettingMain activeTab={activeTab} />
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

export default SiteSettingsPage
