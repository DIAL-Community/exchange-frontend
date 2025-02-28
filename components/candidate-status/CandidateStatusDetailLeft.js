import Share from '../shared/common/Share'
import CandidateStatusDetailHeader from './fragments/CandidateStatusDetailHeader'

const CandidateStatusDetailLeft = ({ candidateStatus }) => {
  return (
    <div className='bg-dial-slate-100 lg:h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <CandidateStatusDetailHeader candidateStatus={candidateStatus} />
        <hr className='border-b border-dial-slate-200' />
        <div className='hidden lg:flex flex-col gap-y-3'>
          <Share />
        </div>
      </div>
    </div>
  )
}

export default CandidateStatusDetailLeft
