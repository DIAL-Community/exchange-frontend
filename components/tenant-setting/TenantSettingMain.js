import TenantSettingMainLeft from './TenantSettingMainLeft'
import TenantSettingMainRight from './TenantSettingMainRight'

const TenantSettingMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-24 3xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <TenantSettingMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <TenantSettingMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default TenantSettingMain
