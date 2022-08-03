import { useIntl } from 'react-intl'

const contactJustifyStyle = 'flex my-5 px-4'
const contactTextStyle = 'inline-block card-title text-button-gray'

const ContactCard = ({ contact, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    listType === 'list'
      ? (
        <div className='border-3 border-transparent text-button-gray'>
          <div className='border border-dial-gray card-drop-shadow'>
            <div className={contactJustifyStyle}>
              <div className={contactTextStyle} data-testid='nameLabel'>
                {format('contact.name.label')}
              </div>
              <div className={`${contactTextStyle} mx-1`} data-testid='contactName'>
                {contact.name}
              </div>
            </div>
            <div className={contactJustifyStyle}>
              <div className={contactTextStyle} data-testid='emailLabel'>
                {format('contact.email.label')}
              </div>
              <div className={`${contactTextStyle} mx-1`} data-testid='contactEmail'>
                {contact.email}
              </div>
            </div>
            <div className={contactJustifyStyle}>
              <div className={contactTextStyle} data-testid='titleLabel'>
                {format('contact.title.label')}
              </div>
              <div className={`${contactTextStyle} mx-1`} data-testid='contactTitle'>
                {contact.title}
              </div>
            </div>
          </div>
        </div>
      )
      : <div data-testid='contactLabel'>{format('contact.label')}</div>
  )
}

export default ContactCard
