import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import UseCaseDetailHeader from '../fragments/UseCaseDetailHeader'
import UseCaseStepDetailNav from './fragments/UseCaseStepDetailNav'

const UseCaseStepDetailLeft = ({ useCase, scrollRef }) => {
  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-6 py-3'>
        <UseCaseDetailHeader useCase={useCase}/>
        <hr className='bg-slate-200'/>
        <UseCaseStepDetailNav useCase={useCase} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
        <Bookmark />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default UseCaseStepDetailLeft
