import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { FormattedMessage, useIntl } from 'react-intl'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import { handleLoadingSession, handleSessionError } from '../../components/shared/SessionQueryHandler'
import ClientOnly from '../../lib/ClientOnly'

const AdminPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn()
    }
  }, [status])

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
        { status === 'unauthenticated' || status === 'loading'
          ? handleLoadingSession()
          : status === 'authenticated' && data?.user.isAdminUser
            ? <AdminLandingPage />
            : handleSessionError()
        }
        <Footer />
      </ClientOnly>
    </>
  )
}

const AdminLandingPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='min-h-[70vh] px-4 lg:px-8 xl:px-56 py-16'>
      <div className='flex flex-col gap-y-8'>
        <div className='text-lg font-semibold lg:col-span-3'>
          {format('ui.admin.siteConfiguration.header')}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 text-sm'>
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
          <Link href='/users' className='bg-dial-iris-blue rounded-lg p-4 flex'>
            <div className='text-white border-b border-transparent hover: hover:border-white'>
              <FormattedMessage id='ui.user.header' />
            </div>
          </Link>
          <Link href='/task-trackers' className='bg-dial-iris-blue rounded-lg p-4 flex'>
            <div className='text-white border-b border-transparent hover: hover:border-white'>
              <FormattedMessage id='ui.taskTracker.header' />
            </div>
          </Link>
        </div>
        <div className='text-lg font-semibold lg:col-span-3'>
          {format('ui.admin.coreData.header')}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 text-sm'>
          <Link href='/countries' className='bg-dial-iris-blue rounded-lg p-4 flex'>
            <div className='text-white border-b border-transparent hover: hover:border-white'>
              <FormattedMessage id='ui.country.header' />
            </div>
          </Link>
          <Link href='/regions' className='bg-dial-iris-blue rounded-lg p-4 flex'>
            <div className='text-white border-b border-transparent hover: hover:border-white'>
              <FormattedMessage id='ui.region.header' />
            </div>
          </Link>
          <Link href='/sectors' className='bg-dial-iris-blue rounded-lg p-4 flex'>
            <div className='text-white border-b border-transparent hover: hover:border-white'>
              <FormattedMessage id='ui.sector.header' />
            </div>
          </Link>
          <Link href='/tags' className='bg-dial-iris-blue rounded-lg p-4 flex'>
            <div className='text-white border-b border-transparent hover: hover:border-white'>
              <FormattedMessage id='ui.tag.header' />
            </div>
          </Link>
        </div>
        <div className='text-lg font-semibold lg:col-span-3'>
          {format('ui.admin.candidate.header')}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 text-sm'>
          <Link href='/candidate-statuses' className='bg-dial-iris-blue rounded-lg p-4 flex'>
            <div className='text-white border-b border-transparent hover: hover:border-white'>
              <FormattedMessage id='ui.candidateStatus.header' />
            </div>
          </Link>
        </div>
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
