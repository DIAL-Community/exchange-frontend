import { useRef } from 'react'
import AboutMainLeft from './AboutMainLeft'
import AboutMainRight from './AboutMainRight'

const AboutMain = () => {
  const scrollRef = useRef(null)

  return (
    <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 py-4'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <AboutMainLeft scrollRef={scrollRef} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <AboutMainRight ref={scrollRef} />
        </div>
      </div>
    </div>
  )
}

export default AboutMain
