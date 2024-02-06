import SyncListRight from './fragments/SyncListRight'
import SyncForm from './fragments/SyncForm'

const SyncMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <SyncListRight /> }
      { activeTab === 1 && <SyncForm /> }
    </div>
  )
}

export default SyncMainRight
