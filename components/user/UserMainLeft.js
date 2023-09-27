import UserListLeft from './fragments/UserListLeft'
import UserSimpleLeft from './fragments/UserSimpleLeft'

const UserMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <UserListLeft /> }
      { activeTab === 1 && <UserSimpleLeft />}
    </>
  )
}

export default UserMainLeft
