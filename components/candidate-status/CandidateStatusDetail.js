import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { CANDIDATE_STATUS_DETAIL_QUERY } from '../shared/query/candidateStatus'
import CandidateStatusDetailLeft from './CandidateStatusDetailLeft'
import CandidateStatusDetailRight from './CandidateStatusDetailRight'

const CandidateStatusDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(CANDIDATE_STATUS_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.candidateStatus) {
    return <NotFound />
  }

  const { candidateStatus } = data

  const slugNameMapping = (() => {
    const map = {}
    map[candidateStatus.slug] = candidateStatus.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <CandidateStatusDetailLeft scrollRef={scrollRef} candidateStatus={candidateStatus} />
        </div>
        <div className='lg:basis-2/3'>
          <CandidateStatusDetailRight ref={scrollRef} candidateStatus={candidateStatus} />
        </div>
      </div>
    </div>
  )
}

export default CandidateStatusDetail
