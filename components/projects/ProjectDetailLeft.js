import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import { ObjectType } from '../../lib/constants'
import CommentsCount from '../shared/CommentsCount'
import { useUser } from '../../lib/hooks'

const ProjectDetailLeft = ({ project, canEdit, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const { user } = useUser()
  const { locale } = useRouter()

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/${locale}/projects/${project.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[project.slug] = project.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='w-full inline-flex gap-3'>
        {canEdit && <EditButton type='link' href={generateEditLink()}/>}
        <CommentsCount commentsSectionRef={commentsSectionRef} objectId={project.id} objectType={ObjectType.PROJECT}/>
      </div>
      <div className='h4 font-bold py-4'>{format('ui.project.label')}</div>
      <div className='bg-white border-2 border-dial-gray p-6 lg:mr-6 shadow-lg'>
        <div id='header' className='mb-4'>
          <div className='h2 p-2 text-dial-purple text-clip'>
            {project.name}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectDetailLeft
