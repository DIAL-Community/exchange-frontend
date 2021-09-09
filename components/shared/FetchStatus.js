import { useIntl } from 'react-intl'
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa'

export const Loading = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className='grid place-items-center bg-gradient-to-b from-dial-gray-light to-white'>
      <div className='my-20 text-button-gray text-lg'>
        <FaSpinner size='3em' className='w-full spinner mb-5' />
        <span className='mt-5'>{format('general.fetchingData')}</span>
      </div>
    </div>
  )
}

export const Error = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className='grid place-items-center bg-gradient-to-b from-dial-gray-light to-white'>
      <div className='my-20 text-button-gray text-lg'>
        <FaExclamationCircle size='3em' className='w-full mb-5' />
        <span className='mt-5'>{format('general.fetchError')}</span>
      </div>
    </div>
  )
}
