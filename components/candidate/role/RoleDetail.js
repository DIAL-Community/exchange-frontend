import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../../shared/Breadcrumb'
import { CANDIDATE_ROLE_DETAIL_QUERY } from '../../shared/query/candidateRole'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import RoleDetailRight from './RoleDetailRight'
import RoleDetailLeft from './RoleDetailLeft'

const RoleDetail = ({ id }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(CANDIDATE_ROLE_DETAIL_QUERY, {
    variables: { id }
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
    const map = {}
    map[role.id] = role.email

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-spearmint text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <RoleDetailLeft scrollRef={scrollRef} role={role} />
        </div>
        <div className='lg:basis-2/3'>
          <RoleDetailRight ref={scrollRef} role={role} />
        </div>
      </div>
    </div>
  )
}

export default RoleDetail
