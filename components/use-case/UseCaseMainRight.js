import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import UseCaseDefinition from './fragments/UseCaseDefinition'
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
      { activeTab === 1 && <UseCaseDefinition /> }
      { activeTab === 2 && <UseCaseForm /> }
    </div>
  )
}

export default UseCaseMainRight
