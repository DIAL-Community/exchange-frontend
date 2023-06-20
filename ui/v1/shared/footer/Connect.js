import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Connect = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.footer.connect.title')}
      </div>
      <hr className='bg-dial-angel'/>
      <div className='text-sm text-dial-stratos'>
        {format('ui.footer.connect.subTitle')}
      </div>
      <div className='flex text-white pt-3'>
        <div className='bg-dial-iris-blue rounded-md text-sm'>
          <div className='px-5 py-3'>
            {format('ui.footer.connect.newsletter')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Connect
