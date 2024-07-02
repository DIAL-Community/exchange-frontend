import ProfileDetail from '../users/ProfileDetail'
import HubBreadcrumb from './HubBreadcrumb'

const HubProfileDetail = ({ user }) => {

  return (
    <div className='md:px-4 lg:px-8 xl:px-56 min-h-[80vh]'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <HubBreadcrumb slugNameMapping={{}} />
      </div>
      <div className='md:flex md:h-full'>
        <div className='text-dial-sapphire rounded-lg w-full h-full'>
          <div className='p-6 lg:p-12'>
            <ProfileDetail user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubProfileDetail
