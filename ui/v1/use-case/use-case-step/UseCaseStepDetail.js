import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import Breadcrumb from '../../shared/Breadcrumb'
import { USE_CASE_STEP_QUERY } from '../../shared/query/useCaseStep'
import UseCaseStepDetailRight from './UseCaseStepDetailRight'
import UseCaseStepDetailLeft from './UseCaseStepDetailLeft'

const UseCaseStepDetail = ({ slug, stepSlug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(USE_CASE_STEP_QUERY, {
    variables: { slug, stepSlug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.useCase) {
    return <NotFound />
  }

  const { useCase, useCaseStep } = data

  const slugNameMapping = (() => {
    const map = {}
    map[useCase.slug] = useCase.name
    map[useCaseStep.slug] = useCaseStep.name

    return map
  })()

  return (
    <div className='px-56 flex flex-col'>
      <div className='px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-row gap-x-8'>
        <div className='basis-1/3'>
          <UseCaseStepDetailLeft
            scrollRef={scrollRef}
            useCase={useCase}
            useCaseStep={useCaseStep}
          />
        </div>
        <div className='basis-2/3'>
          <UseCaseStepDetailRight
            ref={scrollRef}
            useCase={useCase}
            useCaseStep={useCaseStep}
          />
        </div>
      </div>
    </div>
  )
}

export default UseCaseStepDetail
