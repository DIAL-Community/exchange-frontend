import OpportunityMainLeft from './OpportunityMainLeft'
import OpportunityMainRight from './OpportunityMainRight'

const OpportunityMain = ({ activeTab }) => {
  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='grid grid-cols-3 gap-x-8'>
        <div className='hidden md:block col-span-1'>
          <OpportunityMainLeft activeTab={activeTab} />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <OpportunityMainRight activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default OpportunityMain
