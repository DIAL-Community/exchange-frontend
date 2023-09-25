import OpportunityListLeft from './fragments/OpportunityListLeft'
import OpportunitySimpleLeft from './fragments/OpportunitySimpleLeft'

const OpportunityMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <OpportunityListLeft /> }
      { activeTab === 1 && <OpportunitySimpleLeft />}
      { activeTab === 2 && <OpportunitySimpleLeft /> }
    </>
  )
}

export default OpportunityMainLeft
