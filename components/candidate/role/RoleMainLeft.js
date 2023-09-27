import RoleListLeft from './fragments/RoleListLeft'

const RoleMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <RoleListLeft /> }
    </>
  )
}

export default RoleMainLeft
