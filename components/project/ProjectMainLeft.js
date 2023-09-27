import ProjectListLeft from './fragments/ProjectListLeft'
import ProjectSimpleLeft from './fragments/ProjectSimpleLeft'

const ProjectMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <ProjectListLeft /> }
      { activeTab === 1 && <ProjectSimpleLeft />}
      { activeTab === 2 && <ProjectSimpleLeft /> }
    </>
  )
}

export default ProjectMainLeft
