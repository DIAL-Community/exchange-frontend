import { useQuery } from '@apollo/client'
import { Dialog } from '@headlessui/react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useState } from 'react'
import { FaRegWindowClose } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { MaturityStatus } from '../../lib/constants'
import { WIZARD_PARAMS_QUERY } from '../../queries/wizard'
import { Error, Loading } from '../shared/FetchStatus'
import { WizardStage1, WizardStage2, WizardStage3 } from './StageContent'
import WizardResults from './WizardResults'

const mobileServices = [
  'Airtime',
  'API',
  'HS',
  'Mobile-Internet',
  'Mobile-Money',
  'Ops-Maintenance',
  'OTT',
  'SLA',
  'SMS',
  'User-Interface',
  'USSD',
  'Voice'
]

const Wizard = () => (
  <div className='max-w-catalog mx-auto'>
    <div className='flex flex-col gap-4 divide-y'>
      <WizardHeader />
      <WizardContent />
    </div>
  </div>
)

const WizardHeader = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-8 my-8 px-3'>
      <a id='wizard-anchor' />
      <div className='mx-auto text-4xl font-semibold text-dial-sapphire intro-overview-wizard'>
        {format('wizard.getStarted')}
      </div>
      <div className='mx-auto text-center font-semibold text-dial-stratos max-w-4xl'>
        {format('wizard.getStarted.firstLine')}
      </div>
      <div className='mx-auto text-center text-dial-stratos max-w-4xl'>
        {format('wizard.getStarted.secondLine')}
      </div>
    </div>
  )
}

const WizardContent = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale } = useRouter()

  const [currentStep, setCurrentStep] = useState(0)
  const [resultDisplayed, setResultDisplayed] = useState(false)
  const [allValues, setAllValues] = useState({
    projectPhase: '',
    sectors: [],
    sdgs: [],
    useCase: '',
    countries: [],
    tags: [],
    mobileServices: [],
    buildingBlocks: [],
    productSortHint: '',
    projectSortHint: '',
    playbookSortHint: '',
    datasetSortHint: ''
  })

  const { loading, error, data } = useQuery(WIZARD_PARAMS_QUERY, { variables: { locale } })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  }

  const {
    countries: countryData,
    sectors: sectorData,
    sdgs: sdgData,
    tags: tagData,
    buildingBlocks: buildingBlocksData
  } = data

  const wizardData = {
    sectors: sectorData?.map(({ name, slug }) => ({ label: name, value: name, slug })) ?? [],
    sdgs: sdgData?.map(({ name, slug }) => ({ label: name, value: name, slug })) ?? [],
    countries: countryData?.map(({ name }) => ({ label: name, value: name })) ?? [],
    mobileServices: mobileServices.map(service => ({ label: service, value: service })) ?? [],
    tags: tagData?.map(({ name }) => ({ label: name, value: name })) ?? [],
    buildingBlocks: [
      ...buildingBlocksData?.filter(({ maturity }) => maturity === MaturityStatus.PUBLISHED) ?? [],
      ...buildingBlocksData?.filter(({ maturity }) => maturity === MaturityStatus.DRAFT) ?? []
    ] ?? []
  }

  const availableSteps = [
    <WizardStage1 key='step-1' {...{ wizardData, allValues, setAllValues }} />,
    <WizardStage2 key='step-2' {...{ wizardData, allValues, setAllValues }} />,
    <WizardStage3 key='step-3' inverted {...{ wizardData, allValues, setAllValues }} />
  ]

  const nextAvailable = () => currentStep < availableSteps.length - 1
  const previousAvailable = () => currentStep > 0 && currentStep < availableSteps.length
  const allowViewingResult = () => currentStep === availableSteps.length - 1

  const viewWizardInformation = () => {
    setResultDisplayed(true)
  }

  return (
    <>
      <ResultDialog { ...{ resultDisplayed, setResultDisplayed, allValues, setAllValues }} />
      <div className='px-4 xl:px-40 py-4 xl:py-8'>
        <div className='flex flex-col gap-y-4'>
          <div className=''>{`Step ${currentStep + 1} of ${availableSteps.length}`}</div>
          <div className='flex flex-col xl:flex-row items-start gap-y-4 gap-x-12'>
            <div className='w-full'>{availableSteps[currentStep]}</div>
            <div className='flex gap-2 xl:ml-auto'>
              <button
                onClick={() => {
                  if (previousAvailable())
                    setCurrentStep((currentStep) => currentStep - 1)
                }}
                className={classNames(
                  `${!previousAvailable() && 'hidden'}`,
                  'bg-dial-sunshine border border-dial-sunshine rounded p-3'
                )}
              >
                {format('wizard.back')}
              </button>
              <button
                onClick={() => {
                  if (nextAvailable())
                    setCurrentStep((currentStep) => currentStep + 1)
                }}
                className={classNames(
                  `${!nextAvailable() && 'hidden'}`,
                  'bg-dial-sunshine border border-dial-sunshine rounded p-3'
                )}
              >
                {format('wizard.next')}
              </button>
              <button
                onClick={() => viewWizardInformation()}
                className={classNames(
                  `${!allowViewingResult() && 'hidden'} whitespace-nowrap`,
                  'bg-dial-sunshine border border-dial-sunshine rounded p-3'
                )}
              >
                {format('wizard.seeResults')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const ResultDialog = ({ resultDisplayed, setResultDisplayed, allValues, setAllValues }) => {
  return (
    <Dialog
      className='fixed inset-0 z-100 overflow-y-auto'
      open={resultDisplayed}
      onClose={setResultDisplayed}
    >
      <div className='min-h-screen px-8 py-10'>
        <Dialog.Overlay className='fixed inset-0 bg-dial-gray opacity-80' />
        <span className='inline-block h-screen align-baseline' aria-hidden='true'>
          &#8203;
        </span>
        <div
          className={classNames(
            'inline-block w-full max-w-catalog p-3 align-middle',
            'transition-all transform bg-white shadow-xl rounded-2xl'
          )}
        >
          <Dialog.Title>
            <div className='flex'>
              <div className='ml-auto'>
                <button type='button' onClick={() => setResultDisplayed(!resultDisplayed)}>
                  <FaRegWindowClose className='text-dial-stratos opacity-50' size='1.5em' />
                </button>
              </div>
            </div>
          </Dialog.Title>
          <div className='flex flex-col gap-4 px-4 pb-4'>
            <WizardResults { ...{ allValues, setAllValues }} />
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default Wizard
