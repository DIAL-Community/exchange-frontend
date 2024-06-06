const ContactForm = ({ user }) => {

  return (
    <div>
      <h1>UserProfileForm</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

export default ContactForm
