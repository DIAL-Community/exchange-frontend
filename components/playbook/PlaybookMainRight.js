import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import PlaybookForm from './forms/PlaybookForm'
import PlaybookDefinition from './fragments/PlaybookDefinition'
import PlaybookListRight from './fragments/PlaybookListRight'

const PlaybookMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <PlaybookListRight />
      : <RequireAuth />
    : <PlaybookListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <PlaybookDefinition /> }
      { activeTab === 2 && <PlaybookForm /> }
    </div>
  )
}

export default PlaybookMainRight
