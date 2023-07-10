import UserBookmarkLeft from './fragments/UserBookmarkLeft'

const UserMainLeft = ({ activeTab, toggleRef }) => {

  return (
    <>
      { activeTab === 1 && <UserBookmarkLeft toggleRef={toggleRef} />}
    </>
  )
}

export default UserMainLeft
