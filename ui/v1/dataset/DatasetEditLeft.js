import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import DatasetDetailHeader from './fragments/DatasetDetailHeader'

const DatasetEditLeft = ({ dataset }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <DatasetDetailHeader dataset={dataset}/>
        <hr className='bg-slate-200'/>
        <Bookmark object={dataset} objectType={ObjectType.DATASET}/>
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default DatasetEditLeft
