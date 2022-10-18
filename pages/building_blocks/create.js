import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ClientOnly from '../../lib/ClientOnly'
import BuildingBlockForm from '../../components/building-blocks/BuildingBlockForm'

const CreateBuildingBlock = () => (
  <>
    <Header />
    <ClientOnly>
      <BuildingBlockForm />
    </ClientOnly>
    <Footer />
  </>
)

export default CreateBuildingBlock
