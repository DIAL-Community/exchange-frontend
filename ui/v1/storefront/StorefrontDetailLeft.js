import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import StorefrontDetailHeader from './fragments/StorefrontDetailHeader'
import StorefrontDetailNav from './fragments/StorefrontDetailNav'
import StorefrontOwner from './fragments/StorefrontOwner'

const StorefrontDetailLeft = ({ scrollRef, organization }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <StorefrontDetailHeader organization={organization}/>
        <hr className='border-b border-dial-slate-200'/>
        <StorefrontOwner organization={organization}/>
        <hr className='border-b border-dial-slate-200'/>
        <StorefrontDetailNav organization={organization} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <Bookmark object={organization} objectType={ObjectType.ORGANIZATION} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
        <Comment entityKey={'ui.storefront.label'} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default StorefrontDetailLeft
