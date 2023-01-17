import { useCallback, useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { WizardStage1, WizardStage2, WizardStage3 } from './StageContent'

const WizardContent = ({ stage, setStage, projData, allValues, setAllValues }) => {
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
      return (<div className='xl:w-1/2 text-sm'><FormattedMessage id='wizard.intro' values={{ linebreak: <br /> }} /></div>)
    case 1:
      return (<WizardStage1 projData={projData} allValues={allValues} setAllValues={setAllValues} />)
    case 2:
      return (<WizardStage2 projData={projData} allValues={allValues} setAllValues={setAllValues} />)
    case 3:
      return (<WizardStage3 projData={projData} allValues={allValues} setAllValues={setAllValues} />)
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
      <div className='bg-dial-gray-dark text-dial-gray-light p-5 w-full relative wizard-content xl:wizard-content-xl'>
        <div className='flex gap-4'>
          <div className='w-5/6 flex flex-col mb-24 gap-3 mx-6 lg:mx-6 xl:mx-16'>
            <div className='text-2xl'>{getTitle()}</div>
            <div className='flex-grow'>{getContent()}</div>
            <div className='text-button-gray-light absolute bottom-8'>
              <button
                onClick={() => { stage > 0 && setStage(stage - 1) }}
                className={`
                  ${hideBack() === true && 'hidden'}
                  bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4
                `}
              >
                <img src='/icons/left-arrow.svg' className='inline mr-2' alt='Back' height='20px' width='20px' />
                {format('wizard.back')}
              </button>
              <button
                onClick={() => { stage < 4 && setStage(stage + 1) }}
                className={`
                  ${hideNext() === true && 'hidden'}
                  bg-button-gray border border-dial-yellow rounded p-4 my-4 lg:mr-4
                `}
              >
                {stage === 3
                  ? format('wizard.seeResults')
                  : <div>
                    {format('wizard.next')}
                    <img src='/icons/right-arrow.svg' className='inline ml-2' alt='Next' height='20px' width='20px' />
                  </div>
                }
              </button>
            </div>
          </div>
          <div className='ml-auto'>
            <button
              onClick={() => {
                router.push('/products')
              }}
              className='bg-button-gray p-4 rounded text-button-gray-light'
            >
              <img src='/icons/close.svg' className='inline mr-2' alt='Close' height='20px' width='20px' />
              <div className='hidden lg:inline'>{format('wizard.close')}</div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default WizardContent
