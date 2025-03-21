import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import UseCaseListRight from './fragments/UseCaseListRight'
import UseCaseForm from './fragments/UseCaseForm'

const UseCaseMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <UseCaseListRight />
      : <RequireAuth />
    : <UseCaseListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <UseCaseForm /> }
    </div>
  )
}

export default UseCaseMainRight
