import CityDefinition from './fragments/CityDefinition'
import CityListRight from './fragments/CityListRight'
import CityForm from './fragments/CityForm'

const CityMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <CityListRight /> }
      { activeTab === 1 && <CityDefinition /> }
      { activeTab === 2 && <CityForm /> }
    </div>
  )
}

export default CityMainRight
