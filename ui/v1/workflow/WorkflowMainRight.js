import WorkflowDefinition from './fragments/WorkflowDefinition'
import WorkflowListRight from './fragments/WorkflowListRight'
import WorkflowForm from './fragments/WorkflowForm'

const WorkflowMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <WorkflowListRight /> }
      { activeTab === 1 && <WorkflowDefinition /> }
      { activeTab === 2 && <WorkflowForm /> }
    </div>
  )
}

export default WorkflowMainRight
