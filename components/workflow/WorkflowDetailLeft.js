import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import WorkflowDetailHeader from './fragments/WorkflowDetailHeader'
import WorkflowDetailNav from './fragments/WorkflowDetailNav'

const WorkflowDetailLeft = ({ scrollRef, workflow }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <WorkflowDetailHeader workflow={workflow}/>
        <hr className='border-b border-dial-slate-200'/>
        <WorkflowDetailNav workflow={workflow} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={workflow} objectType={ObjectType.WORKFLOW} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.workflow.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default WorkflowDetailLeft
