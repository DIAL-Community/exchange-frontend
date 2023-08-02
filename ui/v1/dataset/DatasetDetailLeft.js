import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import DatasetDetailHeader from './fragments/DatasetDetailHeader'
import DatasetDetailNav from './fragments/DatasetDetailNav'
import DatasetOwner from './fragments/DatasetOwner'

const DatasetDetailLeft = ({ scrollRef, dataset }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <DatasetDetailHeader dataset={dataset}/>
        <hr className='bg-slate-200'/>
        <DatasetOwner dataset={dataset}/>
        <hr className='bg-slate-200'/>
        <DatasetDetailNav dataset={dataset} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
        <Bookmark object={dataset} objectType={ObjectType.ORGANIZATION} />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default DatasetDetailLeft
