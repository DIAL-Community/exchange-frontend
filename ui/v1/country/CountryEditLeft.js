import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import CountryDetailHeader from './fragments/CountryDetailHeader'

const CountryEditLeft = ({ country }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <CountryDetailHeader country={country}/>
        <hr className='bg-slate-200'/>
        <Bookmark object={country} objectType={ObjectType.COUNTRY}/>
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default CountryEditLeft
