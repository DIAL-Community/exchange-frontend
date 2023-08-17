import CityListRight from './fragments/CityListRight'

const CityMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <CityListRight /> }
    </div>
  )
}

export default CityMainRight
