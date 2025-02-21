import OrganizationMainLeft from './OrganizationMainLeft'
import OrganizationMainRight from './OrganizationMainRight'

const OrganizationMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-4 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <OrganizationMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-4 md:col-span-3'>
          <OrganizationMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default OrganizationMain
