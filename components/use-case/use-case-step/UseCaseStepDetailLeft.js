import Bookmark from '../../shared/common/Bookmark'
import Comment from '../../shared/common/Comment'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import UseCaseDetailHeader from '../fragments/UseCaseDetailHeader'
import UseCaseStepDetailNav from './fragments/UseCaseStepDetailNav'

const UseCaseStepDetailLeft = ({ useCase, scrollRef }) => {
  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <UseCaseDetailHeader useCase={useCase}/>
        <hr className='border-b border-dial-slate-200'/>
        <UseCaseStepDetailNav useCase={useCase} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={useCase} objectType={ObjectType.USE_CASE}/>
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.useCaseStep.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default UseCaseStepDetailLeft
