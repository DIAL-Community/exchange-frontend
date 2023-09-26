import ContactListLeft from './fragments/ContactListLeft'
import ContactSimpleLeft from './fragments/ContactSimpleLeft'

const ContactMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <ContactListLeft /> }
      { activeTab === 1 && <ContactSimpleLeft />}
      { activeTab === 2 && <ContactSimpleLeft /> }
    </>
  )
}

export default ContactMainLeft
