import TabNav from '../shared/TabNav'

const ProfileTabNav = ({ activeTab, setActiveTab }) => {
  const tabNames = [
    'ui.profile.label',
    'ui.profile.bookmark',
    'ui.profile.candidateProducts'
  ]

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={false}
      exportJsonFn={false}
    />
  )
}

export default ProfileTabNav
