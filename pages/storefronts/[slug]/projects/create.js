import ClientOnly from '../../../../lib/ClientOnly'
import ProjectForm from '../../../../components/projects/ProjectForm'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

const CreateProject = () => (
  <>
    <Header />
    <ClientOnly>
      <ProjectForm />
    </ClientOnly>
    <Footer />
  </>
)

export default CreateProject
