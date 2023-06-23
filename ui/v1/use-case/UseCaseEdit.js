import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { USE_CASE_DETAIL_QUERY } from '../shared/query/useCase'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading } from '../shared/FetchStatus'
import UseCaseForm from './fragments/UseCaseForm'
import UseCaseEditLeft from './UseCaseEditLeft'

const UseCaseEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
    const map = {
      edit: format('app.edit')
    }
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
          <UseCaseEditLeft useCase={useCase} showNav={false} />
        </div>
        <div className='basis-2/3'>
          <UseCaseForm useCase={useCase} />
        </div>
      </div>
    </div>
  )
}

export default UseCaseEdit
