import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import SectorDefinition from './fragments/SectorDefinition'
import SectorListRight from './fragments/SectorListRight'
import SectorForm from './fragments/SectorForm'

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
      { activeTab === 1 && <SectorDefinition /> }
      { activeTab === 2 && <SectorForm /> }
    </div>
  )
}

export default SectorMainRight
