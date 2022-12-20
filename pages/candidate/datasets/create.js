import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import ClientOnly from '../../../lib/ClientOnly'
import DatasetForm from '../../../components/candidate/datasets/DatasetForm'

const CreateDataset = () => (
  <>
    <QueryNotification />
    <GradientBackground />
    <Header />
    <ClientOnly>
      <DatasetForm />
    </ClientOnly>
    <Footer />
  </>
)

export default CreateDataset
