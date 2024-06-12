import dynamic from 'next/dynamic'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'

const DatasetSpreadsheetWithoutSSR = dynamic(
  () => import('../../../components/spreadsheets/DatasetSpreadsheet'),
  { ssr: false }
)

const DatasetSpreadsheet = ({ defaultTenants }) => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <QueryNotification />
      <Header />
      <ClientOnly clientTenants={defaultTenants}>
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

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default DatasetSpreadsheet
