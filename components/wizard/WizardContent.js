
import { useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'

import { WizardStage1, WizardStage2, WizardStage3, WizardStage4 } from './StageContent'

const WizardContent = ({ stage, setStage, projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const router = useRouter()

  useEffect(() => {
    if (stage === 1 && allValues.projectPhase !== '') {
      setStage(2)
    }
  })

  const getTitle = () => {
    switch (stage) {
      case 0:
        return <div className='py-6'>{format('wizard.introStep')}</div>
      case 1:
        return <div className='py-6'>{format('wizard.stepOne')}</div>
      case 2:
        return <div className='py-6'>{format('wizard.stepTwo')}</div>
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
        return (<div className='w-1/2 text-sm'><FormattedMessage id='wizard.intro' values={{ linebreak: <br /> }} /></div>)
      case 1:
        return (<WizardStage1 setAllValues={setAllValues} />)
      case 2:
        return (<WizardStage2 projData={projData} allValues={allValues} setAllValues={setAllValues} />)
      case 3:
        return (<WizardStage3 projData={projData} allValues={allValues} setAllValues={setAllValues} />)
      case 4:
        return (<WizardStage4 projData={projData} allValues={allValues} setAllValues={setAllValues} />)
    }
  }
  const hideNext = () => {
    if (stage === 1 && allValues.projectPhase === '') {
      return true
    }
    if (stage > 4) {
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
      <div className='bg-dial-gray-dark text-dial-gray-light p-6 w-full relative wizard-content'>
        <div className='float-right block'>
          <button
            onClick={() => {
              router.push('/')
            }}
            className='bg-button-gray p-4 float-right rounded text-button-gray-light'
          >
            <img src='/icons/close.svg' className='inline mr-2' alt='Close' height='20px' width='20px' />
            {format('wizard.close')}
          </button>
        </div>
        <div className='px-6'>
          <div className='block text-2xl py-3'>{getTitle()}</div>
          <div className='h-2/3'>{getContent()}</div>
          <div className='float-left py-4 absolute bottom-32'>
            <button onClick={() => { stage < 5 && setStage(stage + 1) }} className={`${hideNext() === true && 'hidden'} bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4 float-right text-button-gray-light`}>
              {stage === 4
                ? format('wizard.seeResults')
                : <div>{format('wizard.next')}<img src='/icons/right-arrow.svg' className='inline ml-2' alt='Next' height='20px' width='20px' /></div>}
            </button>
            <button onClick={() => { stage === 2 && setAllValues(prevValues => { return { ...prevValues, projectPhase: '' } }); stage > 0 && setStage(stage - 1) }} className={`${hideBack() === true && 'hidden'} bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4 text-button-gray-light`}>
              <img src='/icons/left-arrow.svg' className='inline mr-2' alt='Back' height='20px' width='20px' />
              {format('wizard.back')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default WizardContent
