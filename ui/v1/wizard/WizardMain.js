import { WizardContextProvider } from './WizardContext'
import WizardHeader from './WizardHeader'
import WizardRibbon from './WizardRibbon'
import WizardContent from './WizardContent'

const WizardMain = () => {

  return (
    <WizardContextProvider>
      <div className='flex flex-col gap-3'>
        <WizardRibbon />
        <div className='flex flex-col gap-8'>
          <WizardHeader />
          <WizardContent />
        </div>
      </div>
    </WizardContextProvider>
  )
}

export default WizardMain
