import ProfileDetail from '../user/ProfileDetail'
import HubAdminTabs from './HubAdminTabs'

const HubAdminProfile = ({ user }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 min-h-[80vh] py-8'>
      <div className='md:flex md:h-full'>
        <HubAdminTabs />
        <div className='text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full'>
          <div className='p-6 lg:p-12'>
            <ProfileDetail user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubAdminProfile
