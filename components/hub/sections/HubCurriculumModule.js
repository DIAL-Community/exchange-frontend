import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import CommentsSection from '../../shared/comment/CommentsSection'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PLAY_BREADCRUMB_QUERY } from '../../shared/query/play'
import { ObjectType } from '../../utils/constants'
import { DPI_TENANT_NAME } from '../constants'
import { CurriculumContextProvider } from '../curriculum/CurriculumContext'
import CurriculumModule from '../curriculum/CurriculumModule'
import HubBreadcrumb from './HubBreadcrumb'

const HubCurriculumModule = ({ curriculumSlug, moduleSlug }) => {
  const moduleRefs = useRef({})
  const commentsSectionRef = useRef()

  const { loading, data, error } = useQuery(PLAY_BREADCRUMB_QUERY, {
    variables: { playbookSlug: curriculumSlug, playSlug: moduleSlug, owner: DPI_TENANT_NAME },
    context: { headers: { 'Accept-Language': 'en' } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook || !data?.play) {
    return <NotFound />
  }

  const { playbook: curriculum, play: curriculumModule } = data

  const slugNameMapping = (() => {
    const map = {}
    map[curriculum.slug] = curriculum.name
    map[curriculumModule.slug] = curriculumModule.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col min-h-[80vh]'>
      <div
        className='py-4 px-6 sticky bg-dial-blue-chalk text-dial-stratos'
        style={{ top: 'var(--header-height)' }}
      >
        <HubBreadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <CurriculumContextProvider>
        <CurriculumModule
          curriculumSlug={curriculumSlug}
          moduleSlug={moduleSlug}
          moduleRefs={moduleRefs}
        />
      </CurriculumContextProvider>
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={curriculumModule.id}
        objectType={ObjectType.PLAY}
      />
    </div>
  )
}

export default HubCurriculumModule
