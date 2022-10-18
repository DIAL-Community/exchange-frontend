import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import UseCaseForm from '../../../components/use-cases/UseCaseForm'

const CreateUseCase = () => (
  <>
    <Header />
    <ClientOnly>
      <UseCaseForm />
    </ClientOnly>
    <Footer />
  </>
)

export default CreateUseCase
