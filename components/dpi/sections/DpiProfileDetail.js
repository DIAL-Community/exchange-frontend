import ProfileDetail from '../users/ProfileDetail'
import DpiBreadcrumb from './DpiBreadcrumb'

const DpiProfileDetail = ({ user }) => {

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh]'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <DpiBreadcrumb slugNameMapping={{}} />
      </div>
      <div className="md:flex md:h-full">
        <div className="p-12 text-medium text-dial-sapphire rounded-lg w-full h-full">
          <ProfileDetail user={user} />
        </div>
      </div>
    </div>
  )
}

export default DpiProfileDetail
