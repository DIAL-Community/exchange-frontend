import ProfileProfileDetail from './fragments/ProfileProfileDetail'
import ProfileBookmarkRight from './fragments/ProfileBookmarkRight'

const ProfileMainRight = ({ activeTab }) => {
  return (
    <>
      { activeTab === 0 && <ProfileProfileDetail /> }
      { activeTab === 1 && <ProfileBookmarkRight /> }
    </>
  )
}

export default ProfileMainRight
