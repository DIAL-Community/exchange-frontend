import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { USE_CASE_DETAIL_QUERY } from '../shared/query/useCase'
import { Error, Loading } from '../shared/FetchStatus'
import UseCaseDetailRight from './UseCaseDetailRight'
import UseCaseDetailLeft from './UseCaseDetailLeft'

const UseCaseDetail = ({ slug, locale }) => {
  const scrollRef = useRef()

  const { loading, error, data } = useQuery(USE_CASE_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  }

  const { useCase } = data

  return (
    <div className='px-56'>
      <div className='flex flex-row gap-x-8'>
        <div className='basis-1/3'>
          <UseCaseDetailLeft ref={scrollRef} useCase={useCase} />
        </div>
        <div className='basis-2/3'>
          <UseCaseDetailRight ref={scrollRef} useCase={useCase} />
        </div>
      </div>
    </div>
  )
}

export default UseCaseDetail
