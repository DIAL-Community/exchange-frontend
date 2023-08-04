import SdgMainLeft from './SdgMainLeft'
import SdgMainRight from './SdgMainRight'

const SdgMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden xl:block col-span-1'>
          <SdgMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 xl:col-span-2'>
          <SdgMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default SdgMain
