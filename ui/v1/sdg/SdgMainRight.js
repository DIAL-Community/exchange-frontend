import SdgDefinition from './fragments/SdgDefinition'
import SdgListRight from './fragments/SdgListRight'
import SdgForm from './fragments/SdgForm'

const SdgMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <SdgListRight /> }
      { activeTab === 1 && <SdgDefinition /> }
      { activeTab === 2 && <SdgForm /> }
    </div>
  )
}

export default SdgMainRight
