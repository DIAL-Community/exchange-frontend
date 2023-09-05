import ProfileBookmarkLeft from './fragments/ProfileBookmarkLeft'

const ProfileMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 1 && <ProfileBookmarkLeft />}
    </>
  )
}

export default ProfileMainLeft
