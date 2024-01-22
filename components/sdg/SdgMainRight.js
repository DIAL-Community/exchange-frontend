import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import SdgDefinition from './fragments/SdgDefinition'
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
      { activeTab === 1 && <SdgDefinition /> }
    </div>
  )
}

export default SdgMainRight
