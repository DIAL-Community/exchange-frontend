import { useIntl } from 'react-intl'
import { FaExclamationCircle } from 'react-icons/fa'
import { useCallback } from 'react'

const NotFound = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='grid place-items-center bg-gradient-to-b from-dial-gray-light to-white'>
      <div className='my-20 text-button-gray text-lg'>
        <FaExclamationCircle size='3em' className='w-full mb-5' />
        <div className='font-semibold'>{format('app.notFound')}</div>
      </div>
    </div>
  )
}

export default NotFound
