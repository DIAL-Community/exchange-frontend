import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const ContactDetailHeader = ({ contact }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {contact.name}
      </div>
      <div className='flex justify-center items-center py-16 bg-white rounded border'>
        <div className='w-20 h-20 mx-auto'>
          <img
            src='/ui/v1/user-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.contact.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
      </div>
      <div className='text-sm'>
        <a
          className='border-b border-dial-iris-blue'
          href={`mailto:${contact.email}`}
          target='_blank'
          rel='noreferrer'
        >
          {contact.email} ⧉
        </a>
      </div>
    </div>
  )
}

export default ContactDetailHeader
