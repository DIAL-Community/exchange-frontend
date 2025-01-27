import ProfileBookmarkRight from './fragments/ProfileBookmarkRight'
import ProfileMainDetail from './fragments/ProfileMainDetail'
import SubmissionListRight from './fragments/SubmissionListRight'

const ProfileMainRight = ({ activeTab }) => {
  return (
    <>
      { activeTab === 0 && <ProfileMainDetail /> }
      { activeTab === 1 && <ProfileBookmarkRight /> }
      { activeTab === 2 && <SubmissionListRight /> }
    </>
  )
}

export default ProfileMainRight
