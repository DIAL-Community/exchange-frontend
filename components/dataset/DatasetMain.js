import DatasetMainLeft from './DatasetMainLeft'
import DatasetMainRight from './DatasetMainRight'

const DatasetMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-4 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <DatasetMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-4 md:col-span-3'>
          <DatasetMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default DatasetMain
