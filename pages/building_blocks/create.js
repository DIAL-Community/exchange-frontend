import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ClientOnly from '../../lib/ClientOnly'
import BuildingBlockForm from '../../components/building-blocks/BuildingBlockForm'

const CreateBuildingBlock = () => (
  <>
    <Header />
    <div className='max-w-catalog mx-auto'>
      <ClientOnly>
        <BuildingBlockForm />
      </ClientOnly>
    </div>
    <Footer />
  </>
)

export default CreateBuildingBlock
