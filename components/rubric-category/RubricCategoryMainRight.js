import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import RubricCategoryListRight from './fragments/RubricCategoryListRight'
import RubricCategoryForm from './fragments/RubricCategoryForm'

const RubricCategoryMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <RubricCategoryListRight />
      : <RequireAuth />
    : <RubricCategoryListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <RubricCategoryForm /> }
    </div>
  )
}

export default RubricCategoryMainRight
