import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import ExtraAttributeDefinitionListRight from './fragments/ExtraAttributeDefinitionListRight'
import ExtraAttributeDefinitionForm from './fragments/ExtraAttributeDefinitionForm'

const ExtraAttributeDefinitionMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <ExtraAttributeDefinitionListRight />
      : <RequireAuth />
    : <ExtraAttributeDefinitionListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <ExtraAttributeDefinitionForm /> }
    </div>
  )
}

export default ExtraAttributeDefinitionMainRight
