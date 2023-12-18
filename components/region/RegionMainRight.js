import RegionListRight from './fragments/RegionListRight'
import RegionForm from './fragments/RegionForm'

const RegionMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <RegionListRight /> }
      { activeTab === 1 && <RegionForm /> }
    </div>
  )
}

export default RegionMainRight
