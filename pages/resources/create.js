import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ClientOnly from '../../lib/ClientOnly'
import ResourceForm from '../../components/resources/ResourceForm'

const CreateResource = () => (
  <>
    <Header />
    <ClientOnly>
      <ResourceForm />
    </ClientOnly>
    <Footer />
  </>
)

export default CreateResource
