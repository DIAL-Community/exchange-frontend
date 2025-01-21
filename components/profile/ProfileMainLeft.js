import ProfileBookmarkLeft from './fragments/ProfileBookmarkLeft'
import SubmissionSimpleLeft from './fragments/SubmissionSimpleLeft'

const ProfileMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 1 && <ProfileBookmarkLeft />}
      { activeTab === 2 && <SubmissionSimpleLeft />}
    </>
  )
}

export default ProfileMainLeft
