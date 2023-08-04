import SectorDefinition from './fragments/SectorDefinition'
import SectorListRight from './fragments/SectorListRight'
import SectorForm from './fragments/SectorForm'

const SectorMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <SectorListRight /> }
      { activeTab === 1 && <SectorDefinition /> }
      { activeTab === 2 && <SectorForm /> }
    </div>
  )
}

export default SectorMainRight
