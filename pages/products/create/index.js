import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import ProductForm from '../../../components/products/ProductForm'
import { useUser } from '../../../lib/hooks'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'

const CreateProduct = () => {
  const { isAdminUser: isAuthorized, loadingUserSession } = useUser()

  return (
    <>
      <Header/>
      <ClientOnly>
        {loadingUserSession ? <Loading /> : isAuthorized ? <ProductForm /> : <Unauthorized />}
      </ClientOnly>
      <Footer/>
    </>
  )
}

export default CreateProduct
