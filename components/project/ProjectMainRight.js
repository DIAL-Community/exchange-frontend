import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import ProjectDefinition from './fragments/ProjectDefinition'
import ProjectListRight from './fragments/ProjectListRight'
import ProjectForm from './fragments/ProjectForm'

const ProjectMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <ProjectListRight />
      : <RequireAuth />
    : <ProjectListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <ProjectDefinition /> }
      { activeTab === 2 && <ProjectForm /> }
    </div>
  )
}

export default ProjectMainRight
