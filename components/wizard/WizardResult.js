import { useRef } from 'react'
import WizardResultLeft from './WizardResultLeft'
import WizardResultRight from './WizardResultRight'

const WizardResult = () => {

  const scrollRef = useRef(null)

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <WizardResultLeft scrollRef={scrollRef} />
        </div>
        <div className='lg:basis-2/3'>
          <WizardResultRight ref={scrollRef} />
        </div>
      </div>
    </div>
  )
}

export default WizardResult
