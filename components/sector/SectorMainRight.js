import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import SectorForm from './fragments/SectorForm'
import SectorListRight from './fragments/SectorListRight'

const SectorMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <SectorListRight />
      : <RequireAuth />
    : <SectorListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <SectorForm /> }
    </div>
  )
}

export default SectorMainRight
