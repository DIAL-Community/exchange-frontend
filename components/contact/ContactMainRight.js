import { useActiveTenant, useUser } from '../../lib/hooks'
import RequireAuth from '../shared/RequireAuth'
import ContactListRight from './fragments/ContactListRight'
import ContactForm from './fragments/ContactForm'

const ContactMainRight = ({ activeTab }) => {
  const { user } = useUser()
  const { secured } = useActiveTenant()

  const initialDisplay = secured
    ? user
      ? <ContactListRight />
      : <RequireAuth />
    : <ContactListRight />

  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && initialDisplay }
      { activeTab === 1 && <ContactForm /> }
    </div>
  )
}

export default ContactMainRight
