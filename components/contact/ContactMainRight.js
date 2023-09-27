import ContactListRight from './fragments/ContactListRight'
import ContactForm from './fragments/ContactForm'

const ContactMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <ContactListRight /> }
      { activeTab === 1 && <ContactForm /> }
    </div>
  )
}

export default ContactMainRight
