import { useSession } from 'next-auth/react'
import TabNav from '../shared/TabNav'

const ProfileTabNav = ({ activeTab, setActiveTab }) => {
  const { data: { user } } = useSession()

  const tabNames = [
    'ui.profile.label',
    'ui.profile.bookmark'
  ]

  if (user.roles.indexOf('admin') < 0 && user.roles.indexOf('candidate_editor') < 0) {
    tabNames.push('ui.profile.submission')
  }

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={false}
      exportJsonFn={false}
    />
  )
}

export default ProfileTabNav
