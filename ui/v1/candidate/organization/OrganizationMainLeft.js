import OrganizationListLeft from './fragments/OrganizationListLeft'
import OrganizationSimpleLeft from './fragments/OrganizationSimpleLeft'

const OrganizationMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <OrganizationListLeft /> }
      { activeTab === 1 && <OrganizationSimpleLeft />}
    </>
  )
}

export default OrganizationMainLeft
