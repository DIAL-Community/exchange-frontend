import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ClientOnly from '../../lib/ClientOnly'
import WorkflowForm from '../../components/workflows/WorkflowForm'

const CreateBuildingBlock = () => (
  <>
    <Header />
    <div className='max-w-catalog mx-auto'>
      <ClientOnly>
        <WorkflowForm />
      </ClientOnly>
    </div>
    <Footer />
  </>
)

export default CreateBuildingBlock
