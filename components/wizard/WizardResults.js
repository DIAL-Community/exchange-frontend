import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import withApollo from '../../lib/apolloClient'

import DigitalPrinciple from '../principles/DigitalPrinciple'
import ProjectCard from '../projects/ProjectCard'
import ProductCard from '../products/ProductCard'
import OrganizationCard from '../organizations/OrganizationCard'
import UseCaseCard from '../use-cases/UseCaseCard'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import Resource from '../resources/Resource'
import Phases from './Phases'

import { Loading, Error } from '../shared/FetchStatus'

const IDEATION_QUERY = gql`
query Wizard($phase: String!, $sector: String, $buildingBlocks: [String!], $tags: [String!], $country: String, $mobileServices: [String!]) {
  wizard(phase: $phase, sector: $sector, buildingBlocks: $buildingBlocks, tags: $tags, country: $country, mobileServices: $mobileServices) {
    digitalPrinciples {
      name
      slug
      url
    }
    projects {
      name
      slug
      origin {
        slug
      }
    }
    useCases {
      name
      imageFile
      maturity
      slug
      useCaseDescriptions {
        description
      }
    }
  }
}
`

const PLANNING_QUERY = gql`
query Wizard($phase: String!, $sector: String, $buildingBlocks: [String!], $tags: [String!], $country: String, $mobileServices: [String!]) {
  wizard(phase: $phase, sector: $sector, buildingBlocks: $buildingBlocks, tags: $tags, country: $country, mobileServices: $mobileServices) {
    digitalPrinciples {
      name
      slug
      url
    }
    buildingBlocks {
      name
      imageFile
      maturity
      slug
    }
    resources {
      name
      imageUrl
      link
    }
  }
}
`

const IMPLEMENTATION_QUERY = gql`
query Wizard($phase: String!, $sector: String, $buildingBlocks: [String!], $tags: [String!], $country: String, $mobileServices: [String!]) {
  wizard(phase: $phase, sector: $sector, buildingBlocks: $buildingBlocks, tags: $tags, country: $country, mobileServices: $mobileServices) {
    digitalPrinciples {
      name
      slug
      url
    }
    products {
      name
      imageFile
      slug
      origins {
        name
      }
      endorsers {
        slug
      }
    }
    organizations {
      name
      imageFile
      slug
    }
  }
}
`

const EVALUATION_QUERY = gql`
query Wizard($phase: String!, $sector: String, $buildingBlocks: [String!], $tags: [String!], $country: String, $mobileServices: [String!]) {
  wizard(phase: $phase, sector: $sector, buildingBlocks: $buildingBlocks, tags: $tags, country: $country, mobileServices: $mobileServices) {
    digitalPrinciples {
      name
      slug
      url
    }
    resources {
      name
      imageUrl
      link
    }
  }
}
`

const LeftMenu = ({ currentSection, phase, clickHandler }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <div className='block py-3 float-right w-2/3'>
      <div
        className={`${(currentSection === 0) && 'bg-button-gray border-l-2 border-dial-gray-light'} p-4`}
        onClick={() => { clickHandler(0) }}
      >
        {format('wizard.results.principles')}
      </div>
      <div
        className={`${(currentSection === 1) && 'bg-button-gray border-l-2 border-dial-gray-light'} p-4`}
        onClick={() => { clickHandler(1) }}
      >
        {phase === 'Ideation' && format('wizard.results.similarProjects')}
        {phase === 'Planning' && format('wizard.results.buildingBlocks')}
        {phase === 'Implementation' && format('wizard.results.products')}
        {phase === 'Evaluation' && format('wizard.results.resources')}
      </div>
      <div
        className={`${(currentSection === 2) && 'bg-button-gray border-l-2 border-dial-gray-light'} p-4`}
        onClick={() => { clickHandler(2) }}
      >
        {phase === 'Ideation' && format('wizard.results.useCases')}
        {phase === 'Planning' && format('wizard.results.resources')}
        {phase === 'Implementation' && format('wizard.results.aggregators')}
      </div>
      <div
        className={`${(currentSection === 3) && 'bg-button-gray border-l-2 border-dial-gray-light'} p-4`}
        onClick={() => { clickHandler(3) }}
      >
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

  const vars = { phase: allValues.projectPhase, sector: allValues.sector, buildingBlocks: allValues.buildingBlocks, tags: allValues.tags, country: allValues.country, mobileServices: allValues.mobileServices }
  const [runIdeationQuery, { error: ideationErrors }] = useLazyQuery(IDEATION_QUERY, {
    variables: vars,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => { setWizardData(data.wizard); if (wizardData !== undefined) { clickHandler(0) } }
  })
  const [runPlanningQuery, { error: planningErrors }] = useLazyQuery(PLANNING_QUERY, {
    variables: vars,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => { setWizardData(data.wizard); if (wizardData !== undefined) { clickHandler(0) } }
  })
  const [runImplementationQuery, { error: implementationErrors }] = useLazyQuery(IMPLEMENTATION_QUERY, {
    variables: vars,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => { setWizardData(data.wizard); if (wizardData !== undefined) { clickHandler(0) } }
  })
  const [runEvaluationQuery, { error: evaluationErrors }] = useLazyQuery(EVALUATION_QUERY, {
    variables: vars,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => { setWizardData(data.wizard); if (wizardData !== undefined) { clickHandler(0) } }
  })

  const parentRef = useRef(null)
  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const section3Ref = useRef(null)
  const phasesRef = useRef(null)

  const phase = allValues.projectPhase

  useEffect(() => {
    if (allValues.projectPhase === 'Ideation' || allValues.projectPhase === '') { runIdeationQuery() }
    if (allValues.projectPhase === 'Planning') { runPlanningQuery() }
    if (allValues.projectPhase === 'Implementation') { runImplementationQuery() }
    if (allValues.projectPhase === 'Evaluation') { runEvaluationQuery() }
  },
  [allValues.projectPhase])

  const clickHandler = (section) => {
    setCurrentSection(section)
    switch (section) {
      case 0:
        parentRef.current && parentRef.current.scrollTo({
          top: section1Ref.current.offsetTop - 210,
          behavior: 'smooth'
        })
        break
      case 1:
        parentRef.current.scrollTo({
          top: section2Ref.current.offsetTop - 210,
          behavior: 'smooth'
        })
        break
      case 2:
        parentRef.current.scrollTo({
          top: section3Ref.current.offsetTop - 210,
          behavior: 'smooth'
        })
        break
      case 3:
        parentRef.current.scrollTo({
          top: phasesRef.current.offsetTop - 210,
          behavior: 'smooth'
        })
        break
    }
  }

  if (ideationErrors || planningErrors || implementationErrors || evaluationErrors) {
    return <div><Error /></div>
  }

  if (wizardData === undefined) {
    return <div><Loading /></div>
  }

  return (
    <div className='flex w-full relative wizard-content'>
      <div className='bg-dial-gray-dark text-dial-gray-light p-6 w-1/4'>
        <div className='block text-2xl px-6 py-3'>{format('wizard.results')}</div>
        <div className='block py-3 px-6'>{format('wizard.resultsDesc')}</div>
        <LeftMenu currentSection={currentSection} phase={phase} clickHandler={clickHandler} />
        <div className='float-left w-full py-4 px-6'>
          <button onClick={() => { stage > 0 && setStage(stage - 1) }} className='bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4 text-button-gray-light'>
            <img src='/icons/left-arrow.svg' className='inline mr-2' alt='Back' height='20px' width='20px' />
            {format('wizard.back')}
          </button>
        </div>
      </div>
      <div ref={parentRef} className='bg-dial-gray-light text-button-gray-light p-6 w-3/4 h-screen overflow-y-scroll wizard-content'>
        <button
          className='bg-dial-gray p-4 float-right rounded text-button-gray-light'
          onClick={() => { router.push('/') }}
        >
          <img src='/icons/close.svg' className='inline mr-2' alt='Back' height='20px' width='20px' />
          {format('wizard.close')}
        </button>
        <div ref={section1Ref}>
          <div className='text-2xl font-bold py-4'>{format('wizard.results.principles')}</div>
          <div className='pb-4 text-sm'>{format('wizard.results.principlesDesc')}</div>
          <div className='pb-6 grid grid-cols-5'>
            {wizardData.digitalPrinciples.map((principle) => {
              return (
                <DigitalPrinciple key={`${principle.name}`} principle={principle} />
              )
            })}
          </div>
        </div>
        <div ref={section2Ref}>
          <div className='text-2xl font-bold py-4'>
            {phase === 'Ideation' && format('wizard.results.similarProjects')}
            {phase === 'Planning' && format('wizard.results.buildingBlocks')}
            {phase === 'Implementation' && format('wizard.results.products')}
            {phase === 'Evaluation' && format('wizard.results.resources')}
          </div>
          <div className='pb-4 text-sm'>
            {phase === 'Ideation' && (wizardData.projects ? format('wizard.results.similarProjectsDesc') : format('wizard.results.noProjects'))}
            {phase === 'Planning' && (wizardData.buildingBlocks && wizardData.buildingBlocks.length ? format('wizard.results.buildingBlocksDesc') : format('wizard.results.noBuildingBlocks'))}
            {phase === 'Implementation' && (wizardData.products && wizardData.products.length ? format('wizard.results.productsDesc') : format('wizard.results.noProducts'))}
            {phase === 'Evaluation' && format('wizard.results.resourcesDesc')}
          </div>
          <div className='pb-6 grid grid-cols-1 w-3/4'>
            {phase === 'Ideation' && wizardData.projects && wizardData.projects.map((project) => {
              return (<ProjectCard key={`${project.name}`} project={project} listType='list' />)
            })}
            {phase === 'Planning' && wizardData.buildingBlocks && wizardData.buildingBlocks.map((bb) => {
              return (<BuildingBlockCard key={`${bb.name}`} buildingBlock={bb} listType='list' />)
            })}
            {phase === 'Implementation' && wizardData.products && wizardData.products.map((product) => {
              return (<ProductCard key={`${product.name}`} product={product} listType='list' />)
            })}
            {phase === 'Evaluation' && wizardData.resources && (
              <div className='pb-6 grid grid-cols-3'>
                {wizardData.resources.map((resource) => {
                  return (<Resource key={`${resource.name}`} resource={resource} listType='list' />)
                })}
              </div>)}
          </div>
        </div>
        <div ref={section3Ref}>
          <div className='text-2xl font-bold py-4'>
            {phase === 'Ideation' && format('wizard.results.useCases')}
            {phase === 'Planning' && format('wizard.results.resources')}
            {phase === 'Implementation' && format('wizard.results.aggregators')}
          </div>
          <div className='pb-4 text-sm'>
            {phase === 'Ideation' && ((wizardData.useCases && wizardData.useCases.length) ? format('wizard.results.useCasesDesc') : format('wizard.results.noUseCases'))}
            {phase === 'Ideation' && (wizardData.useCases && !wizardData.useCases.length) && <a className='text-dial-teal' href='https://solutions.dial.community/use_cases' target='_blank' rel='noreferrer'>{format('wizard.results.clickHere')}</a>}
            {phase === 'Planning' && format('wizard.results.resourcesDesc')}
            {phase === 'Implementation' && format('wizard.results.aggregatorsDesc')}
          </div>
          <div className='pb-6 grid grid-cols-1 w-3/4'>
            {phase === 'Ideation' && wizardData.useCases && wizardData.useCases.map((useCase) => {
              return (<UseCaseCard key={`${useCase.name}`} useCase={useCase} listType='list' />)
            })}
            {phase === 'Planning' && wizardData.resources && (
              <div className='pb-6 grid grid-cols-3'>
                {wizardData.resources.map((resource) => {
                  return (<Resource key={`${resource.name}`} resource={resource} listType='list' />)
                })}
              </div>)}
            {phase === 'Implementation' && wizardData.organizations && wizardData.organizations.map((org) => {
              return (<OrganizationCard key={`${org.name}`} organization={org} listType='list' />)
            })}
          </div>
        </div>
        <div ref={phasesRef}>
          <div className='text-2xl font-bold py-4'>{format('wizard.results.phases')}</div>
          <div className='pb-4 text-sm'>{format('wizard.results.phasesDesc')}</div>
          <div className='grid grid-cols-1 w-3/4'>
            <Phases currPhase={phase} setAllValues={setAllValues} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default withApollo()(WizardResults)
