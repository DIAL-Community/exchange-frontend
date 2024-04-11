import dynamic from 'next/dynamic'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'

const ProductSpreadsheetWithoutSSR = dynamic(
  () => import('../../../components/spreadsheets/ProductSpreadsheet'),
  { ssr: false }
)

const ProductSpreadsheet = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <QueryNotification />
      <Header />
      <ClientOnly clientTenants={['default', 'fao']}>
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
