import CityListLeft from './fragments/CityListLeft'
import CitySimpleLeft from './fragments/CitySimpleLeft'

const CityMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <CityListLeft /> }
      { activeTab === 1 && <CitySimpleLeft />}
      { activeTab === 2 && <CitySimpleLeft /> }
    </>
  )
}

export default CityMainLeft
