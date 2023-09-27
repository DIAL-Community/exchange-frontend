import UserListRight from './fragments/UserListRight'
import UserForm from './fragments/UserForm'

const UserMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <UserListRight /> }
      { activeTab === 1 && <UserForm /> }
    </div>
  )
}

export default UserMainRight
