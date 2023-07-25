import UserProfileDetail from './fragments/UserProfileDetail'
import UserBookmarkRight from './fragments/UserBookmarkRight'

const UserMainRight = ({ activeTab }) => {
  return (
    <>
      { activeTab === 0 && <UserProfileDetail /> }
      { activeTab === 1 && <UserBookmarkRight /> }
    </>
  )
}

export default UserMainRight
