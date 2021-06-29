import { useIntl } from 'react-intl'

const Phases = ({ currPhase, setAllValues }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className='lg:flex'>
      {currPhase !== 'Ideation' && (
        <div
          className='lg:w-1/4 lg:h-40 border-4 border-dial-teal m-2 py-4 px-3 hover:border-dial-yellow'
          onClick={() => setAllValues(prevValues => { return { ...prevValues, projectPhase: 'Ideation' } })}
        >
          <div className='text-xl font-bold'>
            {format('wizard.ideation')}
          </div>
          <div className='text-sm'>
            {format('wizard.ideationDesc')}
          </div>
        </div>
      )}
      {currPhase !== 'Planning' && (
        <div
          className='lg:w-1/4 border-4 border-dial-teal m-2 py-4 px-3 hover:border-dial-yellow'
          onClick={() => setAllValues(prevValues => { return { ...prevValues, projectPhase: 'Planning' } })}
        >
          <div className='text-xl font-bold'>
            {format('wizard.planning')}
          </div>
          <div className='text-sm'>
            {format('wizard.planningDesc')}
          </div>
        </div>
      )}
      {currPhase !== 'Implementation' && (
        <div
          className='lg:w-1/4 border-4 border-dial-teal m-2 py-4 px-3 hover:border-dial-yellow'
          onClick={() => setAllValues(prevValues => { return { ...prevValues, projectPhase: 'Implementation' } })}
        >
          <div className='text-xl font-bold'>
            {format('wizard.implementation')}
          </div>
          <div className='text-sm'>
            {format('wizard.implementationDesc')}
          </div>
        </div>
      )}
      {currPhase !== 'Evaluation' && (
        <div
          className='lg:w-1/4 border-4 border-dial-teal m-2 py-4 px-3 hover:border-dial-yellow'
          onClick={() => setAllValues(prevValues => { return { ...prevValues, projectPhase: 'Evaluation' } })}
        >
          <div className='text-xl font-bold'>
            {format('wizard.monitoring')}
          </div>
          <div className='text-sm'>
            {format('wizard.monitoringDesc')}
          </div>
        </div>
      )}
    </div>
  )
}

export default Phases
