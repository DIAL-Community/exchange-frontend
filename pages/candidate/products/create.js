import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import ProductForm from '../../../components/candidate/products/ProductForm'
import ClientOnly from '../../../lib/ClientOnly'

const CreateProduct = () => (
  <>
    <QueryNotification />
    <GradientBackground />
    <Header />
    <ClientOnly>
      <ProductForm />
    </ClientOnly>
    <Footer />
  </>
)

export default CreateProduct
