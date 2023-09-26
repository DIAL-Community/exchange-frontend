import { useIntl } from 'react-intl'
import { useCallback, useContext } from 'react'
import { WizardContext, WizardDispatchContext } from '../WizardContext'

const WizardResultHeader = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentStep } = useContext(WizardContext)
  const { setCurrentStep } = useContext(WizardDispatchContext)

  const returnToParameters = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='text-2xl font-semibold text-dial-iris-blue'>
        <div className='py-3'>
          {format('ui.wizard.result.header')}
        </div>
      </div>
      <div className='text-sm'>
        {format('ui.wizard.result')}
      </div>
      <div className='flex text-sm text-white mt-3 mb-6'>
        <button onClick={returnToParameters}>
          <div className='px-5 py-2 rounded-md bg-dial-iris-blue'>
            {format('ui.wizard.navigateToParameters')}
          </div>
        </button>
      </div>
    </div>
  )

}

export default WizardResultHeader
