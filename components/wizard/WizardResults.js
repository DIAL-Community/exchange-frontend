import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import Select from '../shared/Select'
import UseCaseCard from '../use-cases/UseCaseCard'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import { Loading, Error } from '../shared/FetchStatus'
import PaginatedBuildingBlockList from '../building-blocks/PaginatedBuildingBlockList'
import PaginatedUseCaseList from '../use-cases/PaginatedUseCaseList'
import Lifecycle from './Lifecycle'
import PagedAggregatorsList from './paginated/PagedAggregatorsList'
import PagedProductList from './paginated/PagedProductList'
import PagedProjectList from './paginated/PagedProjectList'

const sortHintOptions = [
  { value: 'name', label: 'Sort by Name' },
  { value: 'country', label: 'Sort by Country' },
  { value: 'sector', label: 'Sort by Sector' },
  { value: 'tag', label: 'Sort by Tag' }
]

const WIZARD_QUERY = gql`
query Wizard(
  $sector: String,
  $subsector: String,
  $sdg: String,
  $buildingBlocks: [String!]
) {
  wizard(
    sector: $sector,
    subsector: $subsector,
    sdg: $sdg,
    buildingBlocks: $buildingBlocks
  ) {
    digitalPrinciples {
      phase
      name
      slug
      url
    }
    useCases {
      name
      imageFile
      maturity
      slug
      useCaseDescription {
        description
      }
    }
    buildingBlocks {
      name
      imageFile
      maturity
      slug
    }
    resources {
      phase
      name
      imageUrl
      link
      description
    }
  }
}
`

const LeftMenu = ({ currentSection, clickHandler }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <div className='block py-3 float-right w-3/4 hidden lg:block'>
      <div
        className={`${(currentSection === 0) && 'bg-button-gray border-l-2 border-dial-gray-light'} cursor-pointer`}
        onClick={() => { clickHandler(0) }}
      >
        <div className='p-4 border-r border-transparent hover:border-dial-yellow'>
          {format('wizard.results.principles')}
        </div>
      </div>
      <div
        className={`${(currentSection === 1) && 'bg-button-gray border-l-2 border-dial-gray-light'} cursor-pointer`}
        onClick={() => { clickHandler(1) }}
      >
        <div className='p-4 border-r border-transparent hover:border-dial-yellow'>
          {format('wizard.results.similarProjects')}
        </div>
      </div>
      <div
        className={`${(currentSection === 2) && 'bg-button-gray border-l-2 border-dial-gray-light'} cursor-pointer`}
        onClick={() => { clickHandler(2) }}
      >
        <div className='p-4 border-r border-transparent hover:border-dial-yellow'>
          {format('wizard.results.products')}
        </div>
      </div>
      <div
        className={`${(currentSection === 3) && 'bg-button-gray border-l-2 border-dial-gray-light'} cursor-pointer`}
        onClick={() => { clickHandler(3) }}
      >
        <div className='p-4 border-r border-transparent hover:border-dial-yellow'>
          {format('wizard.results.useCases')}
        </div>
      </div>
      <div
        className={`${(currentSection === 4) && 'bg-button-gray border-l-2 border-dial-gray-light'} cursor-pointer`}
        onClick={() => { clickHandler(4) }}
      >
        <div className='p-4 border-r border-transparent hover:border-dial-yellow'>
          {format('wizard.results.buildingBlocks')}
        </div>
      </div>
      <div
        className={`${(currentSection === 5) && 'bg-button-gray border-l-2 border-dial-gray-light'} cursor-pointer`}
        onClick={() => { clickHandler(5) }}
      >
        <div className='p-4 border-r border-transparent hover:border-dial-yellow'>
          {format('wizard.results.resources')}
        </div>
      </div>
      <div
        className={`${(currentSection === 6) && 'bg-button-gray border-l-2 border-dial-gray-light'} cursor-pointer`}
        onClick={() => { clickHandler(6) }}
      >
        <div className='p-4 border-r border-transparent hover:border-dial-yellow'>
          {format('wizard.results.aggregators')}
        </div>
      </div>
    </div>
  )
}

const WizardResults = ({ allValues, setAllValues, stage, setStage }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [wizardData, setWizardData] = useState()

  const vars = {
    phase: allValues.projectPhase,
    sector: allValues.sector,
    subsector: allValues.subsector,
    sdg: allValues.sdg,
    buildingBlocks: allValues.buildingBlocks
  }

  const [runWizardQuery, { error: wizardErrors }] = useLazyQuery(WIZARD_QUERY, {
    variables: vars,
    fetchPolicy: 'no-cache',
    context: { headers: { 'Accept-Language': router.locale } },
    onCompleted: (data) => { setWizardData(data.wizard) }
  })

  const parentRef = useRef(null)
  const principlesRef = useRef(null)
  const projectsRef = useRef(null)
  const productsRef = useRef(null)
  const useCasesRef = useRef(null)
  const buildingBlocksRef = useRef(null)
  const resourcesRef = useRef(null)
  const aggregatorsRef = useRef(null)

  useEffect(() => {
    runWizardQuery()
  }, [])

  const clickHandler = (section) => {
    setCurrentSection(section)
    switch (section) {
    case 0:
      parentRef.current && parentRef.current.scrollTo({
        top: principlesRef.current.offsetTop - 210,
        behavior: 'smooth'
      })
      break
    case 1:
      parentRef.current.scrollTo({
        top: projectsRef.current.offsetTop - 210,
        behavior: 'smooth'
      })
      break
    case 2:
      parentRef.current.scrollTo({
        top: productsRef.current.offsetTop - 210,
        behavior: 'smooth'
      })
      break
    case 3:
      parentRef.current.scrollTo({
        top: useCasesRef.current.offsetTop - 210,
        behavior: 'smooth'
      })
      break
    case 4:
      parentRef.current.scrollTo({
        top: buildingBlocksRef.current.offsetTop - 210,
        behavior: 'smooth'
      })
      break
    case 5:
      parentRef.current.scrollTo({
        top: resourcesRef.current.offsetTop - 210,
        behavior: 'smooth'
      })
      break
    case 6:
      parentRef.current.scrollTo({
        top: aggregatorsRef.current.offsetTop - 210,
        behavior: 'smooth'
      })
      break
    }
  }

  if (wizardErrors) {
    return <div><Error /></div>
  }

  if (wizardData === undefined) {
    return <div><Loading /></div>
  }

  return (
    <div className='lg:flex w-full relative wizard-content'>
      <div className='bg-dial-gray-dark text-dial-gray-light p-6 lg:w-1/4'>
        <div className='block text-2xl px-6 py-3'>{format('wizard.results')}</div>
        <div className='block py-3 px-6'>{format('wizard.resultsDesc')}</div>
        <LeftMenu currentSection={currentSection} clickHandler={clickHandler} />
        <div className='float-left w-full py-4 px-6 hidden lg:block'>
          <button onClick={() => { stage > 0 && setStage(stage - 1) }} className='bg-button-gray border border-dial-yellow rounded p-4 my-4 mr-4 text-button-gray-light'>
            <img src='/icons/left-arrow.svg' className='inline mr-2' alt='Back' height='20px' width='20px' />
            {format('wizard.back')}
          </button>
        </div>
      </div>
      <div ref={parentRef} className='bg-dial-gray-light text-button-gray-light p-6 lg:w-3/4 h-screen overflow-y-scroll wizard-content'>
        <button
          className='bg-dial-gray p-4 float-right rounded text-button-gray-light'
          onClick={() => { router.push('/products') }}
        >
          <img src='/icons/close.svg' className='inline mr-2' alt='Back' height='20px' width='20px' />
          {format('wizard.close')}
        </button>
        <div className='text-dial-gray-dark' ref={principlesRef}>
          <div className='text-2xl font-bold py-4'>{format('wizard.results.principles')}</div>
          <div className='pb-4 text-sm'>{format('wizard.results.principlesDesc')}</div>
          <Lifecycle wizardData={wizardData} objType='principles' />
        </div>
        <div className='text-dial-gray-dark' ref={projectsRef}>
          <div className='flex w-3/4 justify-between'>
            <div className='text-2xl font-bold'>
              {format('wizard.results.similarProjects')}
            </div>
            <Select
              onChange={(val) => setAllValues(prevValues => { return { ...prevValues, projectSortHint: val && val.value } })}
              options={sortHintOptions}
              placeholder={format('wizard.project.sortHint')}
            />
          </div>
          <div className='pb-6 grid grid-cols-1 w-3/4'>
            <PagedProjectList
              countries={allValues.countries}
              sectors={[allValues.sector]}
              subSectors={[allValues.subsector]}
              tags={allValues.tags}
              projectSortHint={allValues.projectSortHint}
            />
          </div>
        </div>
        <div className='text-dial-gray-dark' ref={productsRef}>
          <div className='flex w-3/4 justify-between'>
            <div className='text-2xl font-bold'>
              {format('wizard.results.products')}
            </div>
            <Select
              onChange={(val) => setAllValues(prevValues => { return { ...prevValues, productSortHint: val && val.value } })}
              options={sortHintOptions.filter(x => x.value !== 'country')}
              placeholder={format('wizard.product.sortHint')}
            />
          </div>
          <div className='pb-6 grid grid-cols-1 w-3/4'>
            <PagedProductList
              buildingBlocks={allValues.buildingBlocks}
              countries={allValues.countries}
              sectors={[allValues.sector]}
              subSectors={[allValues.subsector]}
              tags={allValues.tags}
              productSortHint={allValues.productSortHint}
            />
          </div>
        </div>
        <div className='text-dial-gray-dark' ref={useCasesRef}>
          <div className='text-2xl font-bold py-4'>
            {format('wizard.results.useCases')}
          </div>
          <div className='pb-6 w-3/4 text-sm'>
            {(wizardData.useCases && wizardData.useCases.length ? format('wizard.results.useCasesDesc') : format('wizard.results.noUseCases'))}
            {
              wizardData.useCases && !wizardData.useCases.length &&
                <a
                  className='text-dial-teal'
                  href='https://solutions.dial.community/use_cases' target='_blank' rel='noreferrer'
                >
                  {format('wizard.results.clickHere')}
                </a>
            }
          </div>
          <div className='pb-6 grid grid-cols-1 w-3/4'>
            {
              wizardData.useCases && wizardData.useCases.length > 5 &&
                <PaginatedUseCaseList itemsPerPage={5} items={wizardData.useCases} />
            }
            {
              wizardData.useCases && wizardData.useCases.length <= 5 &&
                wizardData.useCases.map((useCase) => {
                  return (<UseCaseCard key={`${useCase.name}`} useCase={useCase} listType='list' newTab />)
                })
            }
          </div>
        </div>
        <div className='text-dial-gray-dark' ref={buildingBlocksRef}>
          <div className='text-2xl font-bold py-4'>
            {format('wizard.results.buildingBlocks')}
          </div>
          <div className='pb-4 text-sm'>
            {wizardData.buildingBlocks && wizardData.buildingBlocks.length ? format('wizard.results.buildingBlocksDesc') : format('wizard.results.noBuildingBlocks')}
          </div>
          <div className='pb-6 grid grid-cols-1 w-3/4'>
            {
              wizardData.buildingBlocks && wizardData.buildingBlocks.length > 5 &&
                <PaginatedBuildingBlockList itemsPerPage={5} items={wizardData.buildingBlocks} />
            }
            {
              wizardData.buildingBlocks && wizardData.buildingBlocks.length <= 5 &&
                wizardData.buildingBlocks.map((bb) => {
                  return (<BuildingBlockCard key={`${bb.name}`} buildingBlock={bb} listType='list' newTab />)
                })
            }
          </div>
        </div>
        <div className='text-dial-gray-dark' ref={resourcesRef}>
          <div className='text-2xl font-bold py-4'>
            {format('wizard.results.resources')}
          </div>
          <div className='pb-4 text-sm'>
            {format('wizard.results.resourcesDesc')}
          </div>
          <Lifecycle wizardData={wizardData} objType='resources' />
        </div>
        <div className='text-dial-gray-dark' ref={aggregatorsRef}>
          <div className='text-2xl font-bold py-4'>
            {format('wizard.results.aggregators')}
          </div>
          <div className='pb-4 text-sm'>
            {format('wizard.results.aggregatorsDesc')}
          </div>
          <div className='pb-6 grid grid-cols-1 w-3/4'>
            <PagedAggregatorsList
              sectors={[allValues.sectors]}
              subSectors={[allValues.subSectors]}
              countries={allValues.countries}
              services={allValues.mobileServices}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WizardResults
