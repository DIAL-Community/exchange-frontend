import { useIntl } from 'react-intl'

const ProgressBar = ({ stage, setStage }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <div className='w-full lg:w-1/2 pt-3 lg:float-right'>
      <style global jsx>{`
        .progress-line {
          width: calc(100% - 1.5rem - 1rem);
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .progress-padding {
          padding-top: 0.1rem;
          padding-bottom: 0.1rem;
        }
        .progress-padding-complete {
          padding-top: 0.2rem;
          padding-bottom: 0.2rem;
        }
      `}
      </style>
      <div className='flex'>
        <div className='w-1/4 cursor-pointer' onClick={() => setStage(1)}>
          <div className='relative mb-2'>
            <div className={`w-10 h-10 mx-auto ${stage > 0 && 'bg-button-gray'} border border-button-gray rounded-full text-lg flex items-center`}>
              <span className={`text-center ${stage > 0 ? 'text-dial-gray-light' : 'text-button-gray'} w-full`}>
                1
              </span>
            </div>
          </div>
          {(stage === 0 || stage === 1) && <div className='text-xs uppercase text-center'>0% {format('wizard.complete')}</div>}
        </div>

        <div className='w-1/4 cursor-pointer' onClick={() => setStage(2)}>
          <div className='relative mb-2'>
            <div className='absolute flex align-center items-center align-middle content-center progress-line'>
              <div className='w-full rounded items-center align-middle align-center flex-1'>
                <div className={`w-0 bg-button-gray ${stage > 1 ? 'progress-padding-complete' : 'progress-padding'}`} style={{ width: '100%' }} />
              </div>
            </div>

            <div className={`w-10 h-10 mx-auto ${stage > 1 && 'bg-button-gray'} border border-button-gray rounded-full text-lg flex items-center`}>
              <span className={`text-center ${stage > 1 ? 'text-dial-gray-light' : 'text-button-gray'} w-full`}>
                2
              </span>
            </div>
          </div>
          {(stage === 2) && <div className='text-xs uppercase text-center'>33% {format('wizard.complete')}</div>}
        </div>

        <div className='w-1/4 cursor-pointer' onClick={() => setStage(3)}>
          <div className='relative mb-2'>
            <div className='absolute flex align-center items-center align-middle content-center progress-line'>
              <div className='w-full bg-gray-200 rounded items-center align-middle align-center flex-1'>
                <div className={`w-0 bg-button-gray ${stage > 2 ? 'progress-padding-complete' : 'progress-padding'}`} style={{ width: '100%' }} />
              </div>
            </div>

            <div className={`w-10 h-10 mx-auto ${stage > 2 && 'bg-button-gray'} border border-button-gray rounded-full text-lg flex items-center`}>
              <span className={`text-center ${stage > 2 ? 'text-dial-gray-light' : 'text-button-gray'} w-full`}>
                3
              </span>
            </div>
          </div>
          {(stage === 3) && <div className='text-xs uppercase text-center'>67% {format('wizard.complete')}</div>}
        </div>
        <div className='w-1/4 cursor-pointer' onClick={() => setStage(4)}>
          <div className='relative mb-2'>
            <div className='absolute flex align-center items-center align-middle content-center progress-line'>
              <div className='w-full bg-gray-200 rounded items-center align-middle align-center flex-1'>
                <div className={`w-0 bg-button-gray ${stage > 3 ? 'progress-padding-complete' : 'progress-padding'}`} style={{ width: '100%' }} />
              </div>
            </div>

            <div className={`w-10 h-10 mx-auto ${stage > 3 && 'bg-button-gray'} border border-button-gray rounded-full text-lg flex items-center`}>
              <span className={`text-center ${stage > 3 ? 'text-dial-gray-light' : 'text-button-gray'} w-full`}>
                4
              </span>
            </div>
          </div>
          {(stage === 4) && <div className='text-xs uppercase text-center'>100% {format('wizard.complete')}</div>}
        </div>
      </div>
    </div>
  )
}

const WizardHeader = ({ stage, setStage }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <header className='bg-dial-yellow p-5 w-full sticky lg:flex lg:items-center sticky-under-header'>
        <div className='px-6 h1 lg:inline py-3 lg:w-1/2'>{format('wizard.title')}</div>
        <ProgressBar stage={stage} setStage={setStage} />
      </header>
    </>
  )
}

export default WizardHeader
