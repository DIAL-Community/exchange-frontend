import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const Contact = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const emailAddress = process.env.NEXT_PUBLIC_ABOUT_CONTACT

  return (
    <div className='flex flex-col gap-3 py-3'>
      <div className='text-lg text-dial-sapphire font-semibold'>
        {format('ui.contactUs.label')}
      </div>
      <hr className='border-b border-dial-angel'/>
      <div className='text-sm text-dial-stratos'>
        {format('ui.contactUs.subtext')}
      </div>
      <div className='flex text-white pt-3'>
        <div className='bg-dial-iris-blue rounded-md text-sm'>
          <a
            className='border-b border-dial-iris-blue'
            href={`mailto:${emailAddress}`}
            target='_blank'
            rel='noreferrer'
          >
            <div className='px-5 py-2.5'>
              {format('ui.contactUs.label')}
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact
