import ProjectDefinition from './fragments/ProjectDefinition'
import ProjectListRight from './fragments/ProjectListRight'
import ProjectForm from './fragments/ProjectForm'

const ProjectMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <ProjectListRight /> }
      { activeTab === 1 && <ProjectDefinition /> }
      { activeTab === 2 && <ProjectForm /> }
    </div>
  )
}

export default ProjectMainRight
