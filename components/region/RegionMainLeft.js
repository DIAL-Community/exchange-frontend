import RegionListLeft from './fragments/RegionListLeft'
import RegionSimpleLeft from './fragments/RegionSimpleLeft'

const RegionMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <RegionListLeft /> }
      { activeTab === 1 && <RegionSimpleLeft />}
      { activeTab === 2 && <RegionSimpleLeft /> }
    </>
  )
}

export default RegionMainLeft
