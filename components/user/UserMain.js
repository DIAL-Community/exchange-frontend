import UserMainLeft from './UserMainLeft'
import UserMainRight from './UserMainRight'

const UserMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-24 3xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <UserMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <UserMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default UserMain
