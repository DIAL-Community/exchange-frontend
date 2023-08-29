import classNames from 'classnames'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { WizardContext, WizardDispatchContext } from './WizardContext'

const WizardProgressBar = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentStep } = useContext(WizardContext)
  const { setCurrentStep } = useContext(WizardDispatchContext)

  const [steps] = useState([
    'ui.wizard.parameters.base',
    'ui.wizard.parameters.refine',
    'ui.wizard.parameters.buildingBlocks'
  ])

  const indexListStyle = (index) => classNames(
    'flex w-full items-center text-dial-blueberry',
    currentStep >= index ? 'active-border' : 'inactive-border'
  )

  const indexStepStyle = (index) => classNames(
    'flex items-center justify-center',
    currentStep >= index ? 'active-step' : 'inactive-step'
  )

  const updateActiveStep = (selectedStep) => setCurrentStep(selectedStep)

  return (
    <div className='ui-wizard px-4 lg:px-8 xl:px-56 w-full'>
      <div className='flex flex-col gap-y-4 text-sm'>
        <ol
          className="flex items-center w-full"
          style={{ paddingRight: 'var(--wizard-marker-size)' }}
        >
          {steps.map((_, index) => (
            <li key={index} className={index === currentStep ? 'w-full visible' : 'w-full invisible'}>
              {format('ui.wizard.currentStep')}
            </li>
          ))}
        </ol>
        <ol className="flex items-center w-full">
          {steps.map((_, index) => (
            <li key={index} className={indexListStyle(index)}>
              <button type='button' onClick={() => updateActiveStep(index)}>
                <div className={indexStepStyle(index)} />
              </button>
            </li>
          ))}
        </ol>
        <ol className='flex items-center w-full' style={{ paddingRight: 'var(--wizard-marker-size)' }}>
          {steps.map((step, index) => (
            <li key={index} className='w-full font-semibold'>
              <span className={index <= currentStep ? 'text-dial-iris-blue' : 'text-dial-slate-300'}>
                {format(step)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

const WizardStepHeader = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [headerTitles] = useState([
    'ui.wizard.parameters.base',
    'ui.wizard.parameters.refine',
    'ui.wizard.parameters.buildingBlocks'
  ])

  const [headerDescriptions] = useState([
    'ui.wizard.parameters.base.description',
    'ui.wizard.parameters.refine.description',
    'ui.wizard.parameters.buildingBlocks.description'
  ])

  const { currentStep } = useContext(WizardContext)
  const { setCurrentStep } = useContext(WizardDispatchContext)

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToNextStep = () => {
    if (currentStep < headerTitles.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const navigateToResults = () => {
  }

  return (
    <div className='ui-wizard px-4 lg:px-8 xl:px-56 w-full'>
      <div className='flex flex-col lg:flex-row gap-6 w-full'>
        <div className='flex flex-col flex-grow gap-y-4'>
          <div className='font-semibold text-2xl text-dial-iris-blue'>
            {`Step ${currentStep + 1} - ${format(headerTitles[currentStep])}`}
          </div>
          <div className='text-sm max-w-2xl'>
            {format(headerDescriptions[currentStep])}
          </div>
        </div>
        <div className='flex flex-col gap-y-4'>
          <div className='text-sm text-dial-stratos font-semibold'>
            {format('ui.wizard.readyToContinue')}
          </div>
          <div className='flex flex-row gap-x-4 text-sm text-white'>
            <button onClick={goToPreviousStep} disabled={currentStep <= 0}>
              <div
                className={classNames(
                  'px-5 py-2 rounded-md bg-dial-slate-300',
                  currentStep <= 0 ? '' :  'hover:bg-dial-iris-blue'
                )}
              >
                {format('ui.wizard.previousStep')}
              </div>
            </button>
            {currentStep < headerTitles.length - 1 &&
              <button onClick={goToNextStep}>
                <div className='px-5 py-2 rounded-md bg-dial-iris-blue'>
                  {format('ui.wizard.nextStep')}
                </div>
              </button>
            }
            {currentStep === headerTitles.length - 1 &&
              <button onClick={navigateToResults}>
                <div className='px-5 py-2 rounded-md bg-dial-iris-blue'>
                  {format('ui.wizard.navigateToResults')}
                </div>
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const WizardHeader = () => {
  return (
    <div className='w-full flex flex-col gap-y-8'>
      <WizardProgressBar />
      <WizardStepHeader />
    </div>
  )
}

export default WizardHeader
