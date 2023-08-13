import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import OpportunityDetailHeader from './fragments/OpportunityDetailHeader'

const OpportunityEditLeft = ({ opportunity }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <OpportunityDetailHeader opportunity={opportunity}/>
        <hr className='bg-slate-200'/>
        <Bookmark object={opportunity} objectType={ObjectType.OPPORTUNITY}/>
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default OpportunityEditLeft
