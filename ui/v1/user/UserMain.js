import UserMainLeft from './UserMainLeft'
import UserMainRight from './UserMainRight'

const UserMain = ({ activeTab }) => {
  return (
    <div className='px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        {activeTab > 0 &&
          <div className='col-span-1'>
            <UserMainLeft activeTab={activeTab} />
          </div>
        }
        <div className={activeTab > 0 ? 'col-span-2' : 'col-span-3'}>
          <UserMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default UserMain
