import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import OpportunityDetailHeader from './fragments/OpportunityDetailHeader'
import OpportunityDetailNav from './fragments/OpportunityDetailNav'

const OpportunityDetailLeft = ({ scrollRef, opportunity }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <OpportunityDetailHeader opportunity={opportunity}/>
        <hr className='border-b border-dial-slate-200'/>
        <OpportunityDetailNav opportunity={opportunity} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={opportunity} objectType={ObjectType.OPPORTUNITY} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.opportunity.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default OpportunityDetailLeft
