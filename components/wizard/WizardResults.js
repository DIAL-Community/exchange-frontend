import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import withApollo from '../../lib/apolloClient'

import DigitalPrinciple from '../principles/DigitalPrinciple'
import ProjectCard from '../projects/ProjectCard'
import UseCaseCard from '../useCases/UseCaseCard'
import BuildingBlockCard from '../buildingBlocks/BuildingBlockCard'
import Phases from './Phases'

const IDEATION_QUERY = gql`
query Wizard {
  wizard(phase:"Ideation", sector:"Health", buildingBlocks:["Data Collection"]) {
    digitalPrinciples {
      name
      slug
      url
    }
    projects {
      name
      origin {
        slug
      }
    }
    useCases {
      name
      imageUrl
      maturity
      useCaseDescriptions {
        description
      }
    }
  }
}
`

const PLANNING_QUERY = gql`
query Wizard {
  wizard(phase:"Planning", sector:"Health", buildingBlocks:["Data Collection"]) {
    digitalPrinciples {
      name
      slug
      url
    }
    buildingBlocks {
      name
      imageUrl
    }
    resources {
      name
      imageUrl
      link
    }
  }
}
`
const LeftMenu = ({currentSection, phase, clickHandler}) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <div className='block py-3 float-right w-2/3'>
      <div className={`${(currentSection == 0) && 'bg-button-gray border-l-2 border-dial-gray-light'} p-4`}
        onClick={() => { clickHandler(0) }}>
        {format('wizard.results.principles')}
      </div>
      <div className={`${(currentSection == 1) && 'bg-button-gray border-l-2 border-dial-gray-light'} p-4`}
        onClick={() => { clickHandler(1) }}>
        {phase === 'Ideation' && format('wizard.results.similarProjects')}
      </div>
      <div className={`${(currentSection == 2) && 'bg-button-gray border-l-2 border-dial-gray-light'} p-4`}
        onClick={() => { clickHandler(2) }}>
        {phase === 'Ideation' && format('wizard.results.useCases')}
      </div>
      <div className={`${(currentSection == 3) && 'bg-button-gray border-l-2 border-dial-gray-light'} p-4`}
        onClick={() => { clickHandler(3) }}>
        {format('wizard.results.phases')}
      </div>
    </div>
  )
}

const WizardResults = ({ allValues, setAllValues, stage, setStage }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [wizardData, setWizardData] = useState()

  const [runIdeationQuery, { error: ideationErrors, loading: ideationLoading }] = useLazyQuery(IDEATION_QUERY, {
        onCompleted: (data) => { setWizardData(data.wizard) }
      })
  const [runPlanningQuery, { error: planningErrors, loading: planningLoading }] = useLazyQuery(PLANNING_QUERY, {
        onCompleted: (data) => { setWizardData(data.wizard) }
      })

  const parentRef = useRef(null)
  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const section3Ref = useRef(null)
  const phasesRef = useRef(null)

  const phase = allValues.projectPhase

  useEffect(() => { if (allValues.projectPhase === 'Ideaton' || allValues.projectPhase === '') { runIdeationQuery() }
                    if (allValues.projectPhase === 'Planning') { runPlanningQuery() }}, 
        [allValues.projectPhase]);

  const clickHandler = (section) => {
    setCurrentSection(section)
    switch (section) {
      case 0:
        parentRef.current.scrollTo({
          top: section1Ref.current.offsetTop - 210,
          behavior: 'smooth'
        })
        break;
      case 1:
        parentRef.current.scrollTo({
          top: section2Ref.current.offsetTop - 210,
          behavior: 'smooth'
        })
        break;
      case 2:
        parentRef.current.scrollTo({
          top: section3Ref.current.offsetTop - 210,
          behavior: 'smooth'
        })
        break;
      case 3:
        parentRef.current.scrollTo({
          top: phasesRef.current.offsetTop - 210,
          behavior: 'smooth'
        })
        break;
    }
  }
  
  if (ideationLoading || planningLoading) {
    return <div>Fetching</div>
  }
  if (ideationErrors || planningErrors) {
    return <div>Error!</div>
  }

  if (wizardData === undefined) {
    return <div>Loading</div>
  }

  return (
    <div className='flex w-full'>
      <div className='bg-dial-gray-dark text-dial-gray-light p-6 w-1/4 wizard-content'>
        <div className='block text-2xl px-6 py-3'>{format('wizard.results')}</div>
        <div className='block py-3 px-6'>{format('wizard.resultsDesc')}</div>
        <LeftMenu currentSection={currentSection} phase={phase} clickHandler={clickHandler} />
        <div className='float-left w-full py-4 px-6 absolute bottom-32'>
          <button onClick={() => { stage > 0 && setStage(stage - 1) }} className='bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4 text-button-gray-light'>{format('wizard.back')}</button>
        </div>
      </div>
      <div ref={parentRef} className='bg-dial-gray-light text-dial-gray-dark p-6 w-3/4 h-screen overflow-y-scroll wizard-content'>
        <button className='bg-button-gray p-4 float-right rounded text-button-gray-light'
          onClick={() => {router.push('/')}}>
          {format('wizard.close')}
        </button>
        <div ref={section1Ref}>
          <div className='text-2xl font-bold py-4'>{format('wizard.results.principles')}</div>
          <div className='pb-6 grid grid-cols-4'>
            {wizardData.digitalPrinciples.map((principle) => {
              return(
                <DigitalPrinciple key={`${principle.name}`} principle={principle} />
              )
            })}
          </div>
        </div>
        <div ref={section2Ref}>
          <div className='text-2xl font-bold py-4'>
            {phase === 'Ideation' && format('wizard.results.similarProjects')}
            {phase === 'Planning' && format('wizard.results.buildingBlocks')}
          </div>
          <div className='pb-6 grid grid-cols-1 w-3/4'>
            {phase === 'Ideation' && wizardData.projects.map((project) => {
              return(<ProjectCard key={`${project.name}`} project={project} listType='list' />)
            })}
            {phase === 'Planning' && wizardData.buildingBlocks.map((bb) => {
              return(<BuildingBlockCard key={`${bb.name}`} buildingBlock={bb} listType='list' />)
            })}
          </div>
        </div>
        <div ref={section3Ref}>
          <div className='text-2xl font-bold py-4'>
            {phase === 'Ideation' && format('wizard.results.useCases')}
            {phase === 'Planning' && format('wizard.results.resources')}
          </div>
          <div className='pb-6 grid grid-cols-1 w-3/4'>
            {phase === 'Ideation' && wizardData.useCases.map((useCase) => {
              return(<UseCaseCard key={`${useCase.name}`} useCase={useCase} listType='list' />)
            })}
            {phase === 'Planning' && wizardData.resources.map((resource) => {
              return(<Resource key={`${useCase.name}`} useCase={useCase} listType='list' />)
            })}
          </div>
        </div>
        <div ref={phasesRef}>
          <div className='text-2xl font-bold py-4'>{format('wizard.results.phases')}</div>
          <div className='grid grid-cols-1 w-3/4'>
            <Phases currPhase={phase} setAllValues={setAllValues} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default withApollo()(WizardResults)
