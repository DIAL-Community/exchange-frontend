import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useState } from 'react'

import Dropdown from '../general/Dropdown'

const WizardContent = ({ stage, setStage }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const router = useRouter()
  const [projectPhase, setProjectPhase] = useState('')

  const getTitle = () => {
    switch (stage) {
      case 0:
        return 'Introduction'
      case 1:
        return 'Step 1: Project Phase'
      case 2:
        return 'Step 2: Project Information'
      case 3:
        return 'Step 3: Additional Project Information'
      case 4:
        return 'Step 4: Buiilding Blocks'
      case 5:
        return 'Results'
    }
  }
  const getContent = () => {
    switch (stage) {
      case 0:
        return (<div className='w-1/2 text-sm'>The Requirements and Recommendation Wizard is a part of the DIAL Catalog of Digital Solutions. It is a tool designed to provide information and resources to individuals and teams working on development projects that leverage digital tools and technologies.<br /><br />The Wizard can be used at different times during the project lifecycle - ideation, planning, or implementation. The output of this tool will be tailored to provide the resources and information that are applicable to the current project phase.<br /><br />We will first ask a series of brief questions about your project and then generate a report that links to data within the DIAL Catalog as well as to other helpful resources.</div>)
      case 1:
        return (<div className='flex'>
          <div className='w-1/4 h-40 border-2 border-dial-yellow mr-2 py-4 px-3' onClick={() => {setProjectPhase('Ideation')}}><div className='text-xl font-bold'>Ideation</div><div className='text-sm'>Exploring possible solutions to address a specific use case</div></div>
          <div className='w-1/4 border-2 border-dial-teal mx-2 py-4 px-3' onClick={() => {setProjectPhase('Planning')}}><div className='text-xl font-bold'>Planning</div><div className='text-sm'>Writing requirements, preparing RFPs and developing timelines</div></div>
          <div className='w-1/4 border-2 border-dial-violet mx-2 py-4 px-3' onClick={() => {setProjectPhase('Implementation')}}><div className='text-xl font-bold'>Implementation</div><div className='text-sm'>Working with partners to implement all aspects of the project</div></div>
          <div className='w-1/4 border-2 border-dial-teal-light mx-2 py-4 px-3' onClick={() => {setProjectPhase('Evaluaton')}}><div className='text-xl font-bold'>Monitoring and Evaluation</div><div className='text-sm'>Working with partners to implement all aspects of the project</div></div>
          </div>)
        case 2:
          return (<div className='w-1/5'><div className='text-sm py-2'>Select the sector that your project supports</div><Dropdown title='Select a Sector' itemList={['One', 'Two', 'Three']} onChangeValue={(val) => { console.log(val) }} /></div>)
    }
  }
  const hideNext = () => {
    if (stage === 1 && projectPhase === '') {
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
      <div className='bg-dial-gray-dark text-dial-gray-light p-6 w-full'>
        <div className='flow-root'>
          <button
            onClick={() => {
              router.push('/')
            }}
            className='bg-button-gray p-4 float-right text-button-gray-light'
          >{format('wizard.close')}
          </button>
        </div>
        <div className='px-6'>
          <div className='block text-2xl py-3'>{getTitle()}</div>
          {getContent()}
          <div className='float-left py-4'>
            <button onClick={() => { stage < 5 && setStage(stage + 1) }} className={`${hideNext() === true && 'hidden'} bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4 float-right text-button-gray-light`}>Next</button>
            <button onClick={() => { stage > 0 && setStage(stage - 1) }} className={`${hideBack() === true && 'hidden'} bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4 text-button-gray-light`}>Back</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default WizardContent
