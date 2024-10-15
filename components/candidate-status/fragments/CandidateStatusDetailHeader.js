const CandidateStatusDetailHeader = ({ candidateStatus }) => {
  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl font-semibold'>
        {candidateStatus.name}
      </div>
    </div>
  )
}

export default CandidateStatusDetailHeader
