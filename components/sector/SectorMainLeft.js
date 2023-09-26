import SectorListLeft from './fragments/SectorListLeft'
import SectorSimpleLeft from './fragments/SectorSimpleLeft'

const SectorMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <SectorListLeft /> }
      { activeTab === 1 && <SectorSimpleLeft />}
      { activeTab === 2 && <SectorSimpleLeft /> }
    </>
  )
}

export default SectorMainLeft
