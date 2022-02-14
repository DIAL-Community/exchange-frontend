import { useIntl } from 'react-intl'
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa'

export const Loading = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <div className='text-button-gray text-lg' style={{ marginTop: '10%' }}>
      <FaSpinner size='3em' className='w-full spinner mb-5' />
      <div className='text-center mt-5'>{format('general.fetchingData')}</div>
    </div>
  )
}

export const Error = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <div className='text-button-gray text-lg' style={{ marginTop: '10%' }}>
      <FaExclamationCircle size='3em' className='w-full mb-5' />
      <div className='text-center mt-5'>{format('general.fetchError')}</div>
    </div>
  )
}
