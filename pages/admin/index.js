import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { FormattedMessage, useIntl } from 'react-intl'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import ClientOnly from '../../lib/ClientOnly'

const AdminPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('hub.curriculum.label')}
        description={format('hub.curriculum.title')}
      />
      <NextSeo
        title={format('hub.header.adliNetwork')}
        description={format('hub.adliNetwork.subtitle')}
      />
      <ClientOnly clientTenants={defaultTenants}>
        <Header />
        <AdminLandingPage />
        <Footer />
      </ClientOnly>
    </>
  )
}

const AdminLandingPage = () => {
  return (
    <div className='min-h-[70vh] px-4 lg:px-8 xl:px-56 py-16'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='text-xl font-semibold lg:col-span-3'>
          Administrative Configurations
        </div>
        <div className='border-b border-dial-slate-300 lg:col-span-3' />
        <Link href='/admin/tenant-settings' className='bg-dial-iris-blue rounded-lg p-4 flex'>
          <div className='text-white border-b border-transparent hover: hover:border-white'>
            <FormattedMessage id='ui.tenantSetting.header' />
          </div>
        </Link>
        <Link href='/admin/site-settings' className='bg-dial-iris-blue rounded-lg p-4 flex'>
          <div className='text-white border-b border-transparent hover: hover:border-white'>
            <FormattedMessage id='ui.siteSetting.header' />
          </div>
        </Link>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default AdminPage
