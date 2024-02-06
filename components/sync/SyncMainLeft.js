import SyncListLeft from './fragments/SyncListLeft'
import SyncSimpleLeft from './fragments/SyncSimpleLeft'

const SyncMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <SyncListLeft /> }
      { activeTab === 1 && <SyncSimpleLeft />}
      { activeTab === 2 && <SyncSimpleLeft /> }
    </>
  )
}

export default SyncMainLeft
