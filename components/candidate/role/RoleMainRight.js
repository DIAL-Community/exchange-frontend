import RoleListRight from './fragments/RoleListRight'

const RoleMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <RoleListRight /> }
    </div>
  )
}

export default RoleMainRight
