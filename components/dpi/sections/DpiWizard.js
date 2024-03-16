import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { STEPS } from '../../wizard/commons'
import WizardContent from '../../wizard/WizardContent'
import { WizardContext } from '../../wizard/WizardContext'
import WizardHeader from '../../wizard/WizardHeader'

const DpiWizard = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentStep } = useContext(WizardContext)

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='px-4 lg:px-8 xl:px-56 flex flex-col gap-4'>
        <div className='text-2xl font-semibold'>
          {format('dpi.wizard.title')}
        </div>
        <div className='max-w-prose'>
          {format('dpi.wizard.tagLine')}
        </div>
        <hr className='border-b border-dial-blue-chalk my-4' />
      </div>
      {currentStep < STEPS.length &&
        <div className='flex flex-col gap-8'>
          <WizardHeader />
          <WizardContent />
        </div>
      }
    </div>
  )
}

export default DpiWizard
