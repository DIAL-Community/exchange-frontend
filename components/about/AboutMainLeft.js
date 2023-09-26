import Contact from '../shared/common/Contact'
import AboutNav from './fragments/AboutNav'

const AboutMainLeft = ({ scrollRef }) => {

  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <AboutNav scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200'/>
        <Contact />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default AboutMainLeft
