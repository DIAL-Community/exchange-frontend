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
        <hr className='bg-slate-200'/>
        <WorkflowDetailNav workflow={workflow} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
        <Bookmark object={workflow} objectType={ObjectType.WORKFLOW} />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment entityKey={'ui.workflow.label'} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default WorkflowDetailLeft
