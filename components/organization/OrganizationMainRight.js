import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import OrganizationListRight from './fragments/OrganizationListRight'
import OrganizationForm from './fragments/OrganizationForm'

const OrganizationMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <OrganizationListRight />
      : <RequireAuth />
    : <OrganizationListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <OrganizationForm /> }
    </div>
  )
}

export default OrganizationMainRight
