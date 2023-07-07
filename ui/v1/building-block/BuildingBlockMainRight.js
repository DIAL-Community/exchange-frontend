import BuildingBlockDefinition from './fragments/BuildingBlockDefinition'
import BuildingBlockListRight from './fragments/BuildingBlockListRight'
import BuildingBlockForm from './fragments/BuildingBlockForm'

const BuildingBlockMainRight = ({ activeTab }) => {
  return (
    <>
      { activeTab === 0 && <BuildingBlockListRight /> }
      { activeTab === 1 && <BuildingBlockDefinition /> }
      { activeTab === 2 && <BuildingBlockForm /> }
    </>
  )
}

export default BuildingBlockMainRight
