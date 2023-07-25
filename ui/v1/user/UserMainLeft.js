import UserBookmarkLeft from './fragments/UserBookmarkLeft'

const UserMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 1 && <UserBookmarkLeft />}
    </>
  )
}

export default UserMainLeft
