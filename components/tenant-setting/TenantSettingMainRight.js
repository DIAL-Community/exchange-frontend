import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import TenantSettingForm from './fragments/TenantSettingForm'
import TenantSettingListRight from './fragments/TenantSettingListRight'

const TenantSettingMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <TenantSettingListRight />
      : <RequireAuth />
    : <TenantSettingListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <TenantSettingForm /> }
    </div>
  )
}

export default TenantSettingMainRight
