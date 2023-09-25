import ProjectMainLeft from './ProjectMainLeft'
import ProjectMainRight from './ProjectMainRight'

const ProjectMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <ProjectMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <ProjectMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default ProjectMain
