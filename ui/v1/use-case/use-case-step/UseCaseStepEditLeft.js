import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import UseCaseDetailHeader from '../fragments/UseCaseDetailHeader'

const UseCaseStepEditLeft = ({ useCase }) => {
  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <UseCaseDetailHeader useCase={useCase}/>
        <hr className='bg-slate-200'/>
        <Bookmark object={useCase} objectType={ObjectType.USE_CASE}/>
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default UseCaseStepEditLeft
