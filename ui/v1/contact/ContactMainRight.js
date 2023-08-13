import ContactDefinition from './fragments/ContactDefinition'
import ContactListRight from './fragments/ContactListRight'
import ContactForm from './fragments/ContactForm'

const ContactMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <ContactListRight /> }
      { activeTab === 1 && <ContactDefinition /> }
      { activeTab === 2 && <ContactForm /> }
    </div>
  )
}

export default ContactMainRight
