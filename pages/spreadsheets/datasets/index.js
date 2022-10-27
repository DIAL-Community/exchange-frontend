import dynamic from 'next/dynamic'
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'

const DatasetSpreadsheetWithoutSSR = dynamic(
  () => import('../../../components/spreadsheets/DatasetSpreadsheet'),
  { ssr: false }
)

const DatasetSpreadsheet = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <QueryNotification />
      <Header />
      <ClientOnly>
        <div style={{ minHeight: '70vh' }}>
          {loadingUserSession ?
            <Loading /> :
            isAdminUser ? <DatasetSpreadsheetWithoutSSR /> : <Unauthorized />
          }
        </div>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default DatasetSpreadsheet
