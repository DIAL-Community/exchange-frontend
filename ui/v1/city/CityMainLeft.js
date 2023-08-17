import CityListLeft from './fragments/CityListLeft'

const CityMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <CityListLeft /> }
    </>
  )
}

export default CityMainLeft
