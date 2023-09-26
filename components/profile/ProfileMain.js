import ProfileMainLeft from './ProfileMainLeft'
import ProfileMainRight from './ProfileMainRight'
import { ProfileBookmarkContextProvider } from './fragments/ProfileBookmarkContext'

const ProfileMain = ({ activeTab }) => {

  return (
    <ProfileBookmarkContextProvider>
      <div className='px-4 lg:px-8 xl:px-56'>
        <div className='grid grid-cols-3 gap-x-8'>
          {activeTab > 0 &&
            <div className='hidden md:block col-span-1'>
              <ProfileMainLeft activeTab={activeTab} />
            </div>
          }
          <div className={activeTab > 0 ? 'col-span-3 xl:col-span-2' : 'col-span-3'}>
            <ProfileMainRight activeTab={activeTab} />
          </div>
        </div>
      </div>
    </ProfileBookmarkContextProvider>
  )
}

export default ProfileMain
