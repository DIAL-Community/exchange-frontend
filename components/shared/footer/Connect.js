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
      <hr className='border-b border-dial-angel'/>
      <div className='text-sm text-dial-stratos'>
        {format('ui.footer.connect.subTitle')}
      </div>
      <div className='flex text-white pt-3'>
        <div className='bg-dial-iris-blue rounded-md text-sm'>
          <a
            href='//digitalimpactalliance.us11.list-manage.com/subscribe?u=38fb36c13a6fa71469439b2ab&id=18657ed3a5'
            target='_blank'
            rel='noreferrer'
          >
            <div className='px-5 py-2.5'>
              {format('ui.footer.connect.newsletter')}
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Connect
