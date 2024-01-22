import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import StorefrontDefinition from './fragments/StorefrontDefinition'
import StorefrontListRight from './fragments/StorefrontListRight'
import StorefrontForm from './fragments/StorefrontForm'

const StorefrontMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <StorefrontListRight />
      : <RequireAuth />
    : <StorefrontListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <StorefrontDefinition /> }
      { activeTab === 2 && <StorefrontForm /> }
    </div>
  )
}

export default StorefrontMainRight
