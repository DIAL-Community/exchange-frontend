import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import DatasetDetailHeader from './fragments/DatasetDetailHeader'
import DatasetDetailNav from './fragments/DatasetDetailNav'

const DatasetDetailLeft = ({ scrollRef, dataset, editingAllowed }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <DatasetDetailHeader dataset={dataset} editingAllowed={editingAllowed} />
        <hr className='border-b border-dial-slate-200' />
        <DatasetDetailNav dataset={dataset} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200' />
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={dataset} objectType={ObjectType.DATASET} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
          <Comment entityKey={'ui.dataset.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200' />
        </div>
      </div>
    </div>
  )
}

export default DatasetDetailLeft
