import SdgListLeft from './fragments/SdgListLeft'
import SdgSimpleLeft from './fragments/SdgSimpleLeft'

const SdgMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <SdgListLeft /> }
      { activeTab === 1 && <SdgSimpleLeft />}
      { activeTab === 2 && <SdgSimpleLeft /> }
    </>
  )
}

export default SdgMainLeft
