import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import ResourceDetailHeader from './fragments/ResourceDetailHeader'

const ResourceDetailLeft = ({ scrollRef, candidateResource }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ResourceDetailHeader candidateResource={candidateResource}/>
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={candidateResource} objectType={ObjectType.CANDIDATE_RESOURCE} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.candidateResource.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default ResourceDetailLeft
