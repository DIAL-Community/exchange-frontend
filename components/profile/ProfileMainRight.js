import ProfileMainDetail from './fragments/ProfileMainDetail'
import ProfileBookmarkRight from './fragments/ProfileBookmarkRight'

const ProfileMainRight = ({ activeTab }) => {
  return (
    <>
      { activeTab === 0 && <ProfileMainDetail /> }
      { activeTab === 1 && <ProfileBookmarkRight /> }
    </>
  )
}

export default ProfileMainRight
