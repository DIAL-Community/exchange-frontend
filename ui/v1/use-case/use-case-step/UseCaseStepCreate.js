import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useCallback } from 'react'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import Breadcrumb from '../../shared/Breadcrumb'
import { USE_CASE_DETAIL_QUERY } from '../../shared/query/useCase'
import UseCaseStepForm from './fragments/UseCaseStepForm'
import UseCaseStepCreateLeft from './UseCaseStepCreateLeft'

const UseCaseStepCreate = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(USE_CASE_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.useCase) {
    return <NotFound />
  }

  const { useCase } = data

  const slugNameMapping = (() => {
    const map = {
      create: format('app.create')
    }
    map[useCase.slug] = useCase.name

    return map
  })()

  return (
    <div className='px-56 flex flex-col'>
      <div className='px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-row gap-x-8'>
        <div className='basis-1/3'>
          <UseCaseStepCreateLeft useCase={useCase} />
        </div>
        <div className='basis-2/3'>
          <UseCaseStepForm useCase={useCase} />
        </div>
      </div>
    </div>
  )
}

export default UseCaseStepCreate
