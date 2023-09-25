import DatasetListRight from './fragments/DatasetListRight'
import DatasetForm from './fragments/DatasetForm'

const DatasetMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <DatasetListRight /> }
      { activeTab === 1 && <DatasetForm /> }
    </div>
  )
}

export default DatasetMainRight
