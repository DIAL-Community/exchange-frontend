import dynamic from 'next/dynamic'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import { handleLoadingSession, handleSessionError } from '../../../components/shared/SessionQueryHandler'

const ProductSpreadsheetWithoutSSR = dynamic(
  () => import('../../../components/spreadsheets/ProductSpreadsheet'),
  { ssr: false }
)

const ProductSpreadsheet = ({ defaultTenants }) => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <QueryNotification />
      <Header />
      <ClientOnly clientTenants={defaultTenants}>
        <div style={{ minHeight: '70vh' }}>
          {loadingUserSession
            ? handleLoadingSession()
            : isAdminUser
              ? <ProductSpreadsheetWithoutSSR />
              : handleSessionError()
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

export default ProductSpreadsheet
