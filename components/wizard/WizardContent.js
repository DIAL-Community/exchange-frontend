import { useCallback, useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { WizardStage1, WizardStage2, WizardStage3 } from './StageContent'

const WizardContent = ({ stage, setStage, wizardData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const router = useRouter()

  useEffect(() => {
    if (stage === 1 && allValues.projectPhase !== '') {
      setStage(2)
    }
  })

  const getTitle = () => {
    switch (stage) {
    case 0:
      return <div className='lg:py-6'>{format('wizard.introStep')}</div>
    case 1:
      return (
        <>
          <div className='lg:pt-6 pb-2'>{format('wizard.stepOne')}</div>
          <div className='text-sm'>{format('wizard.optional')}</div>
        </>
      )
    case 2:
      return <div className='lg:py-6'>{format('wizard.stepTwo')}</div>
    case 3:
      return <div className='py-6'>{format('wizard.stepThree')}</div>
    case 4:
      return <div className='py-6'>{format('wizard.stepFour')}</div>
    case 5:
      return <div className='py-6'>{format('wizard.results')}</div>
    }
  }

  const getContent = () => {
    switch (stage) {
    case 0:
      return (
        <div className='xl:w-1/2 text-sm'>
          <FormattedMessage id='wizard.intro' values={{ linebreak: <br /> }} />
        </div>
      )
    case 1:
      return <WizardStage1 {...{ wizardData, allValues, setAllValues }} />
    case 2:
      return <WizardStage2 {...{ wizardData, allValues, setAllValues }} />
    case 3:
      return <WizardStage3 {...{ wizardData, allValues, setAllValues }} />
    }
  }

  const hideNext = () => {
    if (stage > 3) {
      return true
    }

    return false
  }

  const hideBack = () => {
    if (stage < 1) {
      return true
    }

    return false
  }

  return (
    <>
      <div className='text-dial-stratos p-5 w-full relative wizard-content xl:wizard-content-xl'>
        <div className='flex gap-4'>
          <div className='w-5/6 flex flex-col mb-24 gap-3 mx-6 lg:mx-6 xl:mx-16'>
            <div className='text-2xl text-dial-sapphire'>{getTitle()}</div>
            <div className='flex-grow'>{getContent()}</div>
            <div className='text-dial-stratos absolute bottom-8 flex gap-2'>
              <button
                onClick={() => { stage > 0 && setStage(stage - 1) }}
                className={`
                  ${hideBack() && 'hidden'}
                  border border-button-gray rounded p-3
                `}
              >
                {format('wizard.back')}
              </button>
              <button
                onClick={() => { stage < 4 && setStage(stage + 1) }}
                className={`
                  ${hideNext() === true && 'hidden'}
                  border border-button-gray rounded p-3
                `}
              >
                {stage === 3
                  ? format('wizard.seeResults')
                  : <div>
                    {format('wizard.next')}
                  </div>
                }
              </button>
            </div>
          </div>
          <div className='ml-auto'>
            <button
              onClick={() => { router.push('/products') }}
              className='border border-button-gray p-4 rounded text-dial-stratos'
            >
              <div className='hidden lg:inline'>{format('wizard.close')}</div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default WizardContent
