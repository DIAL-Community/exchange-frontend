import { useIntl } from 'react-intl'
import { FaSpinner, FaExclamationCircle, FaDownload } from 'react-icons/fa'
import { useCallback } from 'react'

export const Loading = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-dial-alice-blue h-full'>
        <div className='text-button-gray text-lg w-full my-auto flex flex-col gap-4'>
          <FaSpinner size='3em' className='spinner mx-auto' />
          <div className='text-center mt-5'>{format('general.fetchingData')}</div>
        </div>
      </div >
    </div >
  )
}

export const Error = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-dial-alice-blue h-full'>
        <div className='text-button-gray text-lg w-full my-auto flex flex-col gap-4'>
          <FaExclamationCircle size='3em' className='mx-auto' />
          <div className='text-center mt-5'>{format('general.fetchError')}</div>
        </div>
      </div >
    </div >
  )
}

export const Unauthorized = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-dial-alice-blue h-full'>
        <div className='text-button-gray text-lg w-full my-auto flex flex-col gap-4'>
          <FaExclamationCircle size='3em' className='mx-auto' />
          <div className='text-center mt-5'>{format('general.unauthorized')}</div>
        </div>
      </div>
    </div>
  )
}

export const ReadyToDownload = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-dial-alice-blue h-full'>
        <div className='text-button-gray text-lg w-full my-auto flex flex-col gap-4'>
          <FaDownload size='3em' className='mx-auto' />
          <div className='text-center mt-5'>{format('general.ready-to-download')}</div>
        </div>
      </div>
    </div>
  )
}
