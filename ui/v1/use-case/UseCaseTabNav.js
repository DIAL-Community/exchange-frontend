import TabNav from '../shared/TabNav'

const UseCaseTabNav = () => {
  const tabNames = [
    'ui.useCase.header',
    'ui.useCase.whatIs',
    'ui.useCase.createNew'
  ]

  return (
    <TabNav tabNames={tabNames} />
  )
}

export default UseCaseTabNav
