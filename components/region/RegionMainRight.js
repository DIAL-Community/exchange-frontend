import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import RegionListRight from './fragments/RegionListRight'
import RegionForm from './fragments/RegionForm'

const RegionMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <RegionListRight />
      : <RequireAuth />
    : <RegionListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <RegionForm /> }
    </div>
  )
}

export default RegionMainRight
