import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ClientOnly from '../../lib/ClientOnly'
import WorkflowForm from '../../components/workflows/WorkflowForm'

const CreateBuildingBlock = () => (
  <>
    <Header />
    <ClientOnly>
      <WorkflowForm />
    </ClientOnly>
    <Footer />
  </>
)

export default CreateBuildingBlock
