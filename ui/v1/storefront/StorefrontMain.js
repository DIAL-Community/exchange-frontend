import StorefrontMainLeft from './StorefrontMainLeft'
import StorefrontMainRight from './StorefrontMainRight'

const StorefrontMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <StorefrontMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <StorefrontMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default StorefrontMain
