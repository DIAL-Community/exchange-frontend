import { useContext } from 'react'
import { WizardContext } from './WizardContext'
import WizardParameterContent from './fragments/WizardParameterContent'
import WizardRefineContent from './fragments/WizardRefineContent'
import WizardBuildingBlockContent from './fragments/WizardBuildingBlockContent'

const WizardContent = () => {
  const { currentStep } = useContext(WizardContext)

  return (
    <div className='min-h-[40vh]'>
      { currentStep === 0 && <WizardParameterContent /> }
      { currentStep === 1 && <WizardRefineContent /> }
      { currentStep === 2 && <WizardBuildingBlockContent /> }
    </div>
  )
}

export default WizardContent
