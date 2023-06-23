import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { USE_CASE_DETAIL_QUERY } from '../shared/query/useCase'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading } from '../shared/FetchStatus'
import UseCaseDetailRight from './UseCaseDetailRight'
import UseCaseDetailLeft from './UseCaseDetailLeft'

const UseCaseDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(USE_CASE_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  }

  const { useCase } = data

  const slugNameMapping = (() => {
    const map = {}
    map[useCase.slug] = data.useCase.name

    return map
  })()

  return (
    <div className='px-56 flex flex-col'>
      <div className='px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-row gap-x-8'>
        <div className='basis-1/3'>
          <UseCaseDetailLeft scrollRef={scrollRef} useCase={useCase} />
        </div>
        <div className='basis-2/3'>
          <UseCaseDetailRight ref={scrollRef} useCase={useCase} />
        </div>
      </div>
    </div>
  )
}

export default UseCaseDetail
