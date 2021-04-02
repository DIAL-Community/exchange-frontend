import { useIntl, FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'

import { WizardStage1, WizardStage2, WizardStage3, WizardStage4 } from './StageContent'

const WizardContent = ({ stage, setStage, projData, allValues, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const router = useRouter()

  const getTitle = () => {
    switch (stage) {
      case 0:
        return format('wizard.introStep')
      case 1:
        return format('wizard.stepOne')
      case 2:
        return format('wizard.stepTwo')
      case 3:
        return format('wizard.stepThree')
      case 4:
        return format('wizard.stepFour')
      case 5:
        return format('wizard.results')
    }
  }
  const getContent = () => {
    switch (stage) {
      case 0:
        return (<div className='w-1/2 text-sm'>{<FormattedMessage id='wizard.intro' values={{linebreak: <br />}}/>}</div>)
      case 1:
        return (<WizardStage1 setAllValues={setAllValues} />)
        case 2:
          return (<WizardStage2 projData={projData} setAllValues={setAllValues} />)
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
      <div className='bg-dial-gray-dark text-dial-gray-light p-6 w-full wizard-content'>
        <div className='flow-root'>
          <button
            onClick={() => {
              router.push('/')
            }}
            className='bg-button-gray p-4 float-right rounded text-button-gray-light'
          >{format('wizard.close')}
          </button>
        </div>
        <div className='px-6'>
          <div className='block text-2xl py-3'>{getTitle()}</div>
          {getContent()}
          <div className='float-left py-4 absolute bottom-32'>
            <button onClick={() => { stage < 5 && setStage(stage + 1) }} className={`${hideNext() === true && 'hidden'} bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4 float-right text-button-gray-light`}>{stage === 4 ? format('wizard.seeResults') : format('wizard.next')}</button>
            <button onClick={() => { stage > 0 && setStage(stage - 1) }} className={`${hideBack() === true && 'hidden'} bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4 text-button-gray-light`}>{format('wizard.back')}</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default WizardContent
