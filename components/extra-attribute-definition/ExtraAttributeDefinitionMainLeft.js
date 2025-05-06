import ExtraAttributeDefinitionListLeft from './fragments/ExtraAttributeDefinitionListLeft'
import ExtraAttributeDefinitionSimpleLeft from './fragments/ExtraAttributeDefinitionSimpleLeft'

const ExtraAttributeDefinitionMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <ExtraAttributeDefinitionListLeft /> }
      { activeTab === 1 && <ExtraAttributeDefinitionSimpleLeft />}
      { activeTab === 2 && <ExtraAttributeDefinitionSimpleLeft /> }
    </>
  )
}

export default ExtraAttributeDefinitionMainLeft
