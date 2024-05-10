import { useCallback } from 'react'
import { FaCircleExclamation, FaDownload, FaSpinner } from 'react-icons/fa6'
import { useIntl } from 'react-intl'

export const Loading = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-dial-alice-blue h-full'>
        <div className='text-dial-stratos text-lg w-full my-auto flex flex-col gap-4'>
          <FaSpinner size='3em' className='spinner mx-auto' />
          <div className='text-center mt-5'>{format('general.fetchingData')}</div>
        </div>
      </div>
    </div>
  )
}

export const Error = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-dial-alice-blue h-full'>
        <div className='text-dial-stratos text-lg w-full my-auto flex flex-col gap-4'>
          <FaCircleExclamation size='3em' className='mx-auto' />
          <div className='text-center mt-5'>{format('general.fetchError')}</div>
        </div>
      </div>
    </div>
  )
}

export const Unauthorized = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-dial-alice-blue h-full'>
        <div className='text-dial-stratos text-lg w-full my-auto flex flex-col gap-4'>
          <FaCircleExclamation size='3em' className='mx-auto' />
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
        <div className='text-dial-stratos text-lg w-full my-auto flex flex-col gap-4'>
          <FaDownload size='3em' className='mx-auto' />
          <div className='text-center mt-5'>{format('general.ready-to-download')}</div>
        </div>
      </div>
    </div>
  )
}

export const InternalServerError = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-dial-alice-blue h-full'>
        <div className='text-dial-stratos text-lg w-full my-auto flex flex-col gap-4'>
          <FaCircleExclamation size='3em' className='mx-auto' />
          <div className='text-center mt-5'>{format('app.serverError')}</div>
        </div>
      </div>
    </div>
  )
}

export const NotFound = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-gradient-to-b from-dial-gray-light to-white h-full'>
        <div className='text-dial-stratos text-lg w-full my-auto flex flex-col gap-4'>
          <FaCircleExclamation size='3em' className='mx-auto' />
          <div className='text-center mt-5'>{format('app.notFound')}</div>
        </div>
      </div>
    </div>
  )
}
