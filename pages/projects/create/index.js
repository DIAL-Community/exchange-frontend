import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import ProjectForm from '../../../components/projects/ProjectForm'

const CreateProject = () => (
  <>
    <Header />
    <div className='max-w-catalog mx-auto'>
      <ClientOnly>
        <ProjectForm />
      </ClientOnly>
    </div>
    <Footer />
  </>
)

export default CreateProject
