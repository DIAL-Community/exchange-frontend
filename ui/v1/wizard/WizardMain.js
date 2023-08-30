import { useContext } from 'react'
import WizardHeader from './WizardHeader'
import WizardRibbon from './WizardRibbon'
import WizardContent from './WizardContent'
import { WizardContext } from './WizardContext'
import { STEPS } from './commons'
import WizardResult from './WizardResult'

const WizardMain = () => {
  const { currentStep } = useContext(WizardContext)

  return (
    <div className='flex flex-col gap-3'>
      <WizardRibbon />
      {currentStep < STEPS.length &&
        <div className='flex flex-col gap-8'>
          <WizardHeader />
          <WizardContent />
        </div>
      }
      {currentStep >= STEPS.length &&
        <WizardResult />
      }
    </div>
  )
}

export default WizardMain
