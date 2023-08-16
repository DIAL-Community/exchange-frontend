import Bookmark from '../shared/common/Bookmark'
import Comment from '../shared/common/Comment'
import Share from '../shared/common/Share'
import { ObjectType } from '../utils/constants'
import ContactDetailHeader from './fragments/ContactDetailHeader'
import ContactDetailNav from './fragments/ContactDetailNav'

const ContactDetailLeft = ({ scrollRef, contact }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <ContactDetailHeader contact={contact}/>
        <hr className='bg-slate-200'/>
        <ContactDetailNav contact={contact} scrollRef={scrollRef} />
        <hr className='bg-slate-200'/>
        <Bookmark object={contact} objectType={ObjectType.CONTACT} />
        <hr className='bg-slate-200'/>
        <Share />
        <hr className='bg-slate-200'/>
        <Comment />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default ContactDetailLeft