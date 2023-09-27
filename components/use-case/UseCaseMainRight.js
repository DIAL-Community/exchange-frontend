import UseCaseDefinition from './fragments/UseCaseDefinition'
import UseCaseListRight from './fragments/UseCaseListRight'
import UseCaseForm from './fragments/UseCaseForm'

const UseCaseMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <UseCaseListRight /> }
      { activeTab === 1 && <UseCaseDefinition /> }
      { activeTab === 2 && <UseCaseForm /> }
    </div>
  )
}

export default UseCaseMainRight
