import TabNav from '../shared/TabNav'

const UseCaseTabNav = ({ activeTab, setActiveTab }) => {
  const tabNames = [
    'ui.useCase.header',
    'ui.useCase.whatIs',
    'ui.useCase.createNew'
  ]

  return (
    <TabNav { ...{ tabNames, activeTab, setActiveTab }}/>
  )
}

export default UseCaseTabNav
