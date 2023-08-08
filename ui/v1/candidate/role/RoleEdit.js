import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { CANDIDATE_ROLE_DETAIL_QUERY } from '../../shared/query/candidateRole'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import RoleForm from './fragments/RoleForm'
import RoleEditLeft from './RoleEditLeft'

const RoleEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(CANDIDATE_ROLE_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.candidateRole) {
    return <NotFound />
  }

  const { candidateRole: role } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[role.slug] = role.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row'>
        <div className='lg:basis-1/3'>
          <RoleEditLeft role={role} />
        </div>
        <div className='lg:basis-2/3'>
          <RoleForm role={role} />
        </div>
      </div>
    </div>
  )
}

export default RoleEdit
