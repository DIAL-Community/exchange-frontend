import { FaCircleExclamation, FaSpinner } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'

const LoadingSessionHandler = () => {
  return (
    <div className='min-h-[75vh] flex items-center justify-center'>
      <div className='flex flex-col gap-y-6'>
        <FaSpinner size='3em' className='spinner mx-auto' />
        <div className='text-center'>
          <FormattedMessage id='ui.general.processing' />
        </div>
      </div>
    </div>
  )
}

export const handleLoadingSession = () => {
  return <LoadingSessionHandler />
}

const ForbiddenErrorHandler = () => {
  return (
    <div className='min-h-[75vh] flex items-center justify-center'>
      <div className='flex flex-col gap-y-6'>
        <FaCircleExclamation size='3em' className='mx-auto' />
        <div className='text-center'>
          <FormattedMessage id='ui.general.error.forbidden' />
        </div>
      </div>
    </div>
  )
}

export const handleSessionError = () => {
  return <ForbiddenErrorHandler />
}
