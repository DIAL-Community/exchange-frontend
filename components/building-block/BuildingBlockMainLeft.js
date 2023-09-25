import BuildingBlockListLeft from './fragments/BuildingBlockListLeft'
import BuildingBlockSimpleLeft from './fragments/BuildingBlockSimpleLeft'

const BuildingBlockMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <BuildingBlockListLeft /> }
      { activeTab === 1 && <BuildingBlockSimpleLeft />}
      { activeTab === 2 && <BuildingBlockSimpleLeft /> }
    </>
  )
}

export default BuildingBlockMainLeft
