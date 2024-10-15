import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import CandidateStatusForm from './fragments/CandidateStatusForm'
import CandidateStatusListRight from './fragments/CandidateStatusListRight'

const CandidateStatusMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <CandidateStatusListRight />
      : <RequireAuth />
    : <CandidateStatusListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <CandidateStatusForm /> }
    </div>
  )
}

export default CandidateStatusMainRight
