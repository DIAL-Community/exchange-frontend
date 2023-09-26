import SdgDefinition from './fragments/SdgDefinition'
import SdgListRight from './fragments/SdgListRight'

const SdgMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <SdgListRight /> }
      { activeTab === 1 && <SdgDefinition /> }
    </div>
  )
}

export default SdgMainRight
