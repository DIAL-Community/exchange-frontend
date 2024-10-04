import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import Footer from '../../../../components/shared/Footer'
import Header from '../../../../components/shared/Header'
import TenantSettingDetail from '../../../../components/tenant-setting/TenantSettingDetail'
import ClientOnly from '../../../../lib/ClientOnly'

const TenantSettingPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { name } } = useRouter()

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
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <TenantSettingDetail tenantName={name} />
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

export default TenantSettingPage
