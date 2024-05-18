import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PLAYBOOK_DETAIL_QUERY } from '../../shared/query/playbook'
import { CurriculumCoordinator } from './CurriculumCoordinator'
import CurriculumHeader from './CurriculumHeader'
import CurriculumModules from './CurriculumModules'
import CurriculumNavigation from './CurriculumNavigation'

const CurriculumDetail = ({ slug, locale }) => {
  const { data, loading, error } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  const scrollRef = useRef(null)

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  const { playbook: curriculum } = data

  return (
    <CurriculumCoordinator>
      <div className='lg:px-8 xl:px-56 flex flex-col'>
        <div className='flex flex-col lg:flex-row gap-x-8'>
          <div className='lg:basis-1/3'>
            <CurriculumNavigation curriculum={curriculum} scrollRef={scrollRef} />
          </div>
          <div className='lg:basis-2/3'>
            <div className='px-4 lg:px-0 py-4 lg:py-6'>
              <div className='flex flex-col gap-y-3'>
                <CurriculumHeader curriculum={curriculum} />
                <CurriculumModules curriculum={curriculum} ref={scrollRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CurriculumCoordinator>
  )
}

export default CurriculumDetail
