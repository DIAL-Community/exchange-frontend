import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import ResourceListRight from './fragments/ResourceListRight'
import ResourceForm from './fragments/ResourceForm'

const ResourceMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <ResourceListRight />
      : <RequireAuth />
    : <ResourceListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <ResourceForm /> }
    </div>
  )
}

export default ResourceMainRight
