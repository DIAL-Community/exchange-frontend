import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import TagForm from './fragments/TagForm'
import TagListRight from './fragments/TagListRight'

const TagMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <TagListRight />
      : <RequireAuth />
    : <TagListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <TagForm /> }
    </div>
  )
}

export default TagMainRight
