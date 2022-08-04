import { useSession } from 'next-auth/client'
import dynamic from 'next/dynamic'
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'

const ProductSpreadsheetWithoutSSR = dynamic(
  () => import('../../../components/spreadsheets/ProductSpreadsheet'),
  { ssr: false }
)

const ProductSpreadsheet = () => {
  const [session] = useSession()

  return (
    <>
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

export default ProductSpreadsheet
