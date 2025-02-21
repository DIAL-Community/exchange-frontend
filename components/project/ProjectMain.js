import ProjectMainLeft from './ProjectMainLeft'
import ProjectMainRight from './ProjectMainRight'

const ProjectMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-4 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <ProjectMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-4 md:col-span-3'>
          <ProjectMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default ProjectMain
