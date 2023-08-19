import OrganizationDefinition from './fragments/OrganizationDefinition'
import OrganizationListRight from './fragments/OrganizationListRight'
import OrganizationForm from './fragments/OrganizationForm'

const StorefrontMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <OrganizationListRight /> }
      { activeTab === 1 && <OrganizationDefinition /> }
      { activeTab === 2 && <OrganizationForm /> }
    </div>
  )
}

export default StorefrontMainRight
