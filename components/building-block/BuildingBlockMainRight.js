import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import BuildingBlockListRight from './fragments/BuildingBlockListRight'
import BuildingBlockForm from './fragments/BuildingBlockForm'

const BuildingBlockMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <BuildingBlockListRight />
      : <RequireAuth />
    : <BuildingBlockListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <BuildingBlockForm /> }
    </div>
  )
}

export default BuildingBlockMainRight
