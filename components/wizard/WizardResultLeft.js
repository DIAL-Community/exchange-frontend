import Share from '../shared/common/Share'
import Bookmark from '../shared/common/Bookmark'
import { ObjectType } from '../utils/constants'
import WizardResultHeader from './fragments/WizardResultHeader'
import WizardResultNav from './fragments/WizardResultNav'

const WizardResultLeft = ({ scrollRef, useCase }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <WizardResultHeader />
        <hr className='border-b border-dial-slate-200' />
        <WizardResultNav scrollRef={scrollRef} />
        <hr className='border-b border-dial-slate-200' />
        <Bookmark object={useCase} objectType={ObjectType.WIZARD} />
        <hr className='border-b border-dial-slate-200' />
        <Share />
        <hr className='border-b border-dial-slate-200' />
      </div>
    </div>
  )
}

export default WizardResultLeft
