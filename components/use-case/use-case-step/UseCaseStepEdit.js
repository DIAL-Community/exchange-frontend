import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { USE_CASE_STEP_QUERY } from '../../shared/query/useCaseStep'
import UseCaseStepForm from './fragments/UseCaseStepForm'
import UseCaseStepEditLeft from './UseCaseStepEditLeft'

const UseCaseStepEdit = ({ slug, stepSlug }) => {
  const { loading, error, data } = useQuery(USE_CASE_STEP_QUERY, {
    variables: { slug, stepSlug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.useCase) {
    return handleMissingData()
  }

  const { useCase, useCaseStep } = data

  const slugNameMapping = (() => {
    const map = {}
    map[useCase.slug] = useCase.name
    map[useCaseStep.slug] = useCaseStep.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <UseCaseStepEditLeft
            useCase={useCase}
            useCaseStep={useCaseStep}
          />
        </div>
        <div className='lg:basis-2/3'>
          <UseCaseStepForm
            useCase={useCase}
            useCaseStep={useCaseStep}
          />
        </div>
      </div>
    </div>
  )
}

export default UseCaseStepEdit
