import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import ResourceDetailHeader from './fragments/ResourceDetailHeader'
import ResourceDetailNav from './fragments/ResourceDetailNav'

const ResourceDetailRight = ({ scrollRef, resource }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ResourceDetailHeader resource={resource}/>
        <hr className='border-b border-dial-slate-200'/>
        <ResourceDetailNav resource={resource} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={resource} objectType={ObjectType.RESOURCE} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.resource.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default ResourceDetailRight
