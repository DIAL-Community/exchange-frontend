import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import DatasetForm from '../../../components/datasets/DatasetForm'

const CreateOrganization = () => (
  <>
    <Header />
    <ClientOnly>
      <DatasetForm />
    </ClientOnly>
    <Footer />
  </>
)

export default CreateOrganization
