import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import ResourceTopicForm from './fragments/ResourceTopicForm'
import ResourceTopicListRight from './fragments/ResourceTopicListRight'

const ResourceTopicMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <ResourceTopicListRight />
      : <RequireAuth />
    : <ResourceTopicListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <ResourceTopicForm /> }
    </div>
  )
}

export default ResourceTopicMainRight
