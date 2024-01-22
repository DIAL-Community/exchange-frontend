import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import TagDefinition from './fragments/TagDefinition'
import TagListRight from './fragments/TagListRight'
import TagForm from './fragments/TagForm'

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
      { activeTab === 1 && <TagDefinition /> }
      { activeTab === 2 && <TagForm /> }
    </div>
  )
}

export default TagMainRight
