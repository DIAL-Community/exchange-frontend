import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import CityListRight from './fragments/CityListRight'
import CityForm from './fragments/CityForm'

const CityMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <CityListRight />
      : <RequireAuth />
    : <CityListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <CityForm /> }
    </div>
  )
}

export default CityMainRight
