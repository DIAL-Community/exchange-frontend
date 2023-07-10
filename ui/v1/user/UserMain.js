import { useRef } from 'react'
import UserMainLeft from './UserMainLeft'
import UserMainRight from './UserMainRight'
import { BookmarkDisplayContextProvider } from './fragments/BookmarkDisplayContext'

const UserMain = ({ activeTab }) => {
  const toggleRef = useRef()

  return (
    <BookmarkDisplayContextProvider>
      <div className='px-8 xl:px-56'>
        <div className='grid grid-cols-3 gap-x-8'>
          {activeTab > 0 &&
            <div className='col-span-1'>
              <UserMainLeft activeTab={activeTab} toggleRef={toggleRef} />
            </div>
          }
          <div className={activeTab > 0 ? 'col-span-2' : 'col-span-3'}>
            <UserMainRight activeTab={activeTab} toggleRef={toggleRef} />
          </div>
        </div>
      </div>
    </BookmarkDisplayContextProvider>
  )
}

export default UserMain
