import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import CategoryIndicatorDetailHeader from './fragments/CategoryIndicatorDetailHeader'
import CategoryIndicatorDetailNav from './fragments/CategoryIndicatorDetailNav'

const CategoryIndicatorDetailLeft = ({ scrollRef, rubricCategory, categoryIndicator }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <CategoryIndicatorDetailHeader
          rubricCategory={rubricCategory}
          categoryIndicator={categoryIndicator}
        />
        <hr className='border-b border-dial-slate-200'/>
        <CategoryIndicatorDetailNav
          rubricCategory={rubricCategory}
          categoryIndicator={categoryIndicator}
          scrollRef={scrollRef}
        />
        <hr className='border-b border-dial-slate-200'/>
        <Bookmark object={categoryIndicator} objectType={ObjectType.CategoryIndicator} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
        <Comment entityKey={'categoryIndicator.label'} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default CategoryIndicatorDetailLeft
