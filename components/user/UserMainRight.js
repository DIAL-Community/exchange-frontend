import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import UserListRight from './fragments/UserListRight'
import UserForm from './fragments/UserForm'

const UserMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <UserListRight />
      : <RequireAuth />
    : <UserListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <UserForm /> }
    </div>
  )
}

export default UserMainRight
