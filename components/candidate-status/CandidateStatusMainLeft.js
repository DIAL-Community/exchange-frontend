import CandidateStatusListLeft from './fragments/CandidateStatusListLeft'
import CandidateStatusSimpleLeft from './fragments/CandidateStatusSimpleLeft'

const CandidateStatusMainLeft = ({ activeTab }) => {

  return (
    <>
      { activeTab === 0 && <CandidateStatusListLeft /> }
      { activeTab === 1 && <CandidateStatusSimpleLeft />}
      { activeTab === 2 && <CandidateStatusSimpleLeft /> }
    </>
  )
}

export default CandidateStatusMainLeft
