import { useActiveTenant, useUser } from '../../../lib/hooks'
import RequireAuth from '../../shared/RequireAuth'
import RoleListRight from './fragments/RoleListRight'

const RoleMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <RoleListRight />
      : <RequireAuth />
    : <RoleListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
    </div>
  )
}

export default RoleMainRight
