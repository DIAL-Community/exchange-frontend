const UserProfileDetail = ({ contact }) => {

  return (
    <div>
      <h1>UserProfileForm</h1>
      <pre>{JSON.stringify(contact, null, 2)}</pre>
    </div>
  )
}

export default UserProfileDetail
