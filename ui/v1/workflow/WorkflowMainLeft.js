import WorkflowListLeft from './fragments/WorkflowListLeft'
import WorkflowSimpleLeft from './fragments/WorkflowSimpleLeft'

const WorkflowMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <WorkflowListLeft /> }
      { activeTab === 1 && <WorkflowSimpleLeft />}
      { activeTab === 2 && <WorkflowSimpleLeft /> }
    </>
  )
}

export default WorkflowMainLeft
