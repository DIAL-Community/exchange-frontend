import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import DatasetListRight from './fragments/DatasetListRight'
import DatasetForm from './fragments/DatasetForm'

const DatasetMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <DatasetListRight />
      : <RequireAuth />
    : <DatasetListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <DatasetForm /> }
    </div>
  )
}

export default DatasetMainRight
