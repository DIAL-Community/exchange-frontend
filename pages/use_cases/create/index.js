import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import UseCaseForm from '../../../components/use-cases/UseCaseForm'

const CreateUseCase = () => ( 
  <>
    <Header />
    <div className='max-w-catalog mx-auto'>
      <ClientOnly>
        <UseCaseForm />
      </ClientOnly>
    </div>
    <Footer />
  </>
)

export default CreateUseCase
