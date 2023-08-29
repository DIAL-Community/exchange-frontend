import BuildingBlockMainLeft from './BuildingBlockMainLeft'
import BuildingBlockMainRight from './BuildingBlockMainRight'

const BuildingBlockMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <BuildingBlockMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <BuildingBlockMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockMain
