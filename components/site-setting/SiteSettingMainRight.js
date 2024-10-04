import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import SiteSettingForm from './fragments/SiteSettingForm'
import SiteSettingListRight from './fragments/SiteSettingListRight'

const SiteSettingMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <SiteSettingListRight />
      : <RequireAuth />
    : <SiteSettingListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <SiteSettingForm /> }
    </div>
  )
}

export default SiteSettingMainRight
