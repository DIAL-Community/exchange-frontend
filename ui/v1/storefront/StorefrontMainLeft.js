import OrganizationListLeft from './fragments/OrganizationListLeft'
import OrganizationSimpleLeft from './fragments/OrganizationSimpleLeft'

const StorefrontMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <OrganizationListLeft /> }
      { activeTab === 1 && <OrganizationSimpleLeft />}
      { activeTab === 2 && <OrganizationSimpleLeft /> }
    </>
  )
}

export default StorefrontMainLeft
