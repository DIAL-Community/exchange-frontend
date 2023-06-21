import UseCaseDefinition from './UseCaseDefinition'
import UseCaseListRight from './UseCaseListRight'

const UseCaseMainRight = ({ activeTab }) => {
  return (
    <>
      { activeTab === 0 && <UseCaseListRight /> }
      { activeTab === 1 && <UseCaseDefinition /> }
    </>
  )
}

export default UseCaseMainRight
