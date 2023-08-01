import UserMainLeft from './UserMainLeft'
import UserMainRight from './UserMainRight'
import { BookmarkDisplayContextProvider } from './fragments/BookmarkDisplayContext'

const UserMain = ({ activeTab }) => {

  return (
    <BookmarkDisplayContextProvider>
      <div className='lg:px-8 xl:px-56'>
        <div className='grid grid-cols-3 gap-x-8'>
          {activeTab > 0 &&
            <div className='hidden xl:block col-span-1'>
              <UserMainLeft activeTab={activeTab} />
            </div>
          }
          <div className={activeTab > 0 ? 'col-span-3 xl:col-span-2' : 'col-span-3'}>
            <UserMainRight activeTab={activeTab} />
          </div>
        </div>
      </div>
    </BookmarkDisplayContextProvider>
  )
}

export default UserMain
