import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import DatasetForm from '../../../components/datasets/DatasetForm'

const CreateOrganization = () => ( 
  <>
    <Header />
    <div className='max-w-catalog mx-auto'>
      <ClientOnly>
        <DatasetForm />
      </ClientOnly>
    </div>
    <Footer />
  </>
)

export default CreateOrganization
