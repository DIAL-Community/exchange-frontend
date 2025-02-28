import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import SdgListRight from './fragments/SdgListRight'

const SdgMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <SdgListRight />
      : <RequireAuth />
    : <SdgListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
    </div>
  )
}

export default SdgMainRight
