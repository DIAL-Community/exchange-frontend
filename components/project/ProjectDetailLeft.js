import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import ProjectDetailHeader from './fragments/ProjectDetailHeader'
import ProjectDetailNav from './fragments/ProjectDetailNav'

const ProjectDetailLeft = ({ scrollRef, project, editingAllowed }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ProjectDetailHeader project={project} editingAllowed={editingAllowed} />
        <hr className='border-b border-dial-slate-200' />
        <ProjectDetailNav project={project} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200' />
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={project} objectType={ObjectType.PROJECT} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
          <Comment entityKey={'ui.project.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200' />
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailLeft
