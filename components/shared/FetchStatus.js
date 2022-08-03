import { useIntl } from 'react-intl'
import { FaSpinner, FaExclamationCircle, FaDownload } from 'react-icons/fa'

export const Loading = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <div className='text-button-gray text-lg' style={{ marginTop: '10%' }}>
      <FaSpinner size='3em' className='w-full spinner mb-5' />
      <div className='text-center mt-5'>{format('general.fetchingData')}</div>
    </div>
  )
}

export const Error = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <div className='text-button-gray text-lg' style={{ marginTop: '10%' }}>
      <FaExclamationCircle size='3em' className='w-full mb-5' />
      <div className='text-center mt-5'>{format('general.fetchError')}</div>
    </div>
  )
}

export const Unauthorized = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <div className='text-button-gray text-lg' style={{ marginTop: '10%' }}>
      <FaExclamationCircle size='3em' className='w-full mb-5' />
      <div className='text-center mt-5'>{format('general.unauthorized')}</div>
    </div>
  )
}

export const ReadyToDownload = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <div className='text-button-gray text-lg' style={{ marginTop: '10%' }}>
      <FaDownload size='3em' className='w-full mb-5' />
      <div className='text-center mt-5'>{format('general.ready-to-download')}</div>
    </div>
  )
}
