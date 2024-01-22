import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import WorkflowDefinition from './fragments/WorkflowDefinition'
import WorkflowListRight from './fragments/WorkflowListRight'
import WorkflowForm from './fragments/WorkflowForm'

const WorkflowMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <WorkflowListRight />
      : <RequireAuth />
    : <WorkflowListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <WorkflowDefinition /> }
      { activeTab === 2 && <WorkflowForm /> }
    </div>
  )
}

export default WorkflowMainRight
