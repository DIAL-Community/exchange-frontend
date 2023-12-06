import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import CountryDetailHeader from './fragments/CountryDetailHeader'
import CountryDetailNav from './fragments/CountryDetailNav'

const CountryDetailLeft = ({ scrollRef, country }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <CountryDetailHeader country={country}/>
        <hr className='border-b border-dial-slate-200'/>
        <CountryDetailNav country={country} scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Bookmark object={country} objectType={ObjectType.COUNTRY} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
          <Comment entityKey={'ui.country.label'} scrollRef={scrollRef} />
          <hr className='border-b border-dial-slate-200'/>
        </div>
      </div>
    </div>
  )
}

export default CountryDetailLeft
