import OpportunityDefinition from './fragments/OpportunityDefinition'
import OpportunityListRight from './fragments/OpportunityListRight'
import OpportunityForm from './fragments/OpportunityForm'

const OpportunityMainRight = ({ activeTab }) => {
  return (
    <div className='min-h-[50vh]'>
      { activeTab === 0 && <OpportunityListRight /> }
      { activeTab === 1 && <OpportunityDefinition /> }
      { activeTab === 2 && <OpportunityForm /> }
    </div>
  )
}

export default OpportunityMainRight
