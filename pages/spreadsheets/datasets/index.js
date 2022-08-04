import { useSession } from 'next-auth/client'
import dynamic from 'next/dynamic'
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'

const DatasetSpreadsheetWithoutSSR = dynamic(
  () => import('../../../components/spreadsheets/DatasetSpreadsheet'),
  { ssr: false }
)

const DatasetSpreadsheet = () => {
  const [session] = useSession()

  return (
    <>
      <QueryNotification />
      <Header />
      <div className='max-w-catalog mx-auto' style={{ minHeight: '70vh' }}>
        {session?.user?.canEdit &&
          <ClientOnly>
            <DatasetSpreadsheetWithoutSSR />
          </ClientOnly>
        }
      </div>
      <Footer />
    </>
  )
}

export default DatasetSpreadsheet
