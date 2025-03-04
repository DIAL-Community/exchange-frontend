import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import OpportunityListRight from './fragments/OpportunityListRight'
import OpportunityForm from './fragments/OpportunityForm'

const OpportunityMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <OpportunityListRight />
      : <RequireAuth />
    : <OpportunityListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <OpportunityForm /> }
    </div>
  )
}

export default OpportunityMainRight
