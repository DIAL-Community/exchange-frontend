import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import ProjectDetailHeader from './fragments/ProjectDetailHeader'

const ProjectEditLeft = ({ project }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ProjectDetailHeader project={project}/>
        <hr className='border-b border-dial-slate-200'/>
        <Bookmark object={project} objectType={ObjectType.PROJECT}/>
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default ProjectEditLeft
