import DatasetListLeft from './fragments/DatasetListLeft'
import DatasetSimpleLeft from './fragments/DatasetSimpleLeft'

const DatasetMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <DatasetListLeft /> }
      { activeTab === 1 && <DatasetSimpleLeft />}
      { activeTab === 2 && <DatasetSimpleLeft /> }
    </>
  )
}

export default DatasetMainLeft
