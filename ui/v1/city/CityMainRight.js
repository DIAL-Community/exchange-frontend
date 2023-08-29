import CityForm from './fragments/CityForm'
import CityListRight from './fragments/CityListRight'

const CityMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <CityListRight /> }
      { activeTab === 1 && <CityForm /> }
    </div>
  )
}

export default CityMainRight
