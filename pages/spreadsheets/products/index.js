import dynamic from 'next/dynamic'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'
import Header from '../../../ui/v1/shared/Header'
import Footer from '../../../ui/v1/shared/Footer'
import { Loading, Unauthorized } from '../../../ui/v1/shared/FetchStatus'

const ProductSpreadsheetWithoutSSR = dynamic(
  () => import('../../../ui/v1/spreadsheets/ProductSpreadsheet'),
  { ssr: false }
)

const ProductSpreadsheet = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <QueryNotification />
      <Header />
      <ClientOnly>
        <div style={{ minHeight: '70vh' }}>
          {loadingUserSession ?
            <Loading /> :
            isAdminUser ? <ProductSpreadsheetWithoutSSR /> : <Unauthorized />
          }
        </div>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default ProductSpreadsheet
