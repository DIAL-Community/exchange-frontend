import OpportunityDetailHeader from './fragments/OpportunityDetailHeader'

const OpportunityEditLeft = ({ opportunity }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <OpportunityDetailHeader opportunity={opportunity}/>
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default OpportunityEditLeft
