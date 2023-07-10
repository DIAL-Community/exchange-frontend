import UserProfileDetail from './fragments/UserProfileDetail'
import UserBookmarkRight from './fragments/UserBookmarkRight'

const UserMainRight = ({ activeTab, toggleRef }) => {
  return (
    <>
      { activeTab === 0 && <UserProfileDetail /> }
      { activeTab === 1 && <UserBookmarkRight ref={toggleRef} /> }
    </>
  )
}

export default UserMainRight
