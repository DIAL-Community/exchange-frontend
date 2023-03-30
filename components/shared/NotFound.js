import { useIntl } from 'react-intl'
import { FaExclamationCircle } from 'react-icons/fa'
import { useCallback } from 'react'

const NotFound = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='h-[60vh]'>
      <div className='flex bg-gradient-to-b from-dial-gray-light to-white h-full'>
        <div className='text-button-gray text-lg w-full my-auto flex flex-col gap-4'>
          <FaExclamationCircle size='3em' className='mx-auto' />
          <div className='font-semibold text-center'>{format('app.notFound')}</div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
