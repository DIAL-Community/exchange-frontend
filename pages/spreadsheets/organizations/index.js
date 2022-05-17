import { useSession } from 'next-auth/client'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'

const ProductSpreadsheetWithoutSSR = dynamic(
  () => import('../../../components/spreadsheets/ProductSpreadsheet'),
  { ssr: false }
)

const OrganizationSpreadsheet = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id: id }, values), [formatMessage])

  const [session] = useSession()

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <QueryNotification />
      <Header />
      <div className='max-w-catalog mx-auto' style={{ minHeight: '70vh' }}>
        {session?.user?.canEdit &&
          <ClientOnly>
            <ProductSpreadsheetWithoutSSR />
          </ClientOnly>
        }
      </div>
      <Footer />
    </>
  )
}

export default OrganizationSpreadsheet
