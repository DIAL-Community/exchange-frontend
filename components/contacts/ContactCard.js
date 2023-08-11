import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const ContactCard = ({ contact, listType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    listType === 'list'
      ? (
        <div className='px-3 py-2 border text-button-gray rounded-md shadow-md'>
          <div className='flex flex-row gap-3'>
            <div className="username-avatar my-auto">
              <span className="text-dial-gray-dark">
                {contact.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className='flex flex-col'>
              <div className='font-semibold' data-testid='contactName'>
                {contact.name}
              </div>
              <div className='text-sm' data-testid='contactTitle'>
                {contact.title}
              </div>
              <div className='text-sm' data-testid='contactEmail'>
                {contact.email}
              </div>
            </div>
          </div>
        </div>
      )
      : <div data-testid='contactLabel'>{format('ui.contact.label')}</div>
  )
}

export default ContactCard
