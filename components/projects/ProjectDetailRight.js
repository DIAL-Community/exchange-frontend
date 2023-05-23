import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlViewer } from '../shared/HtmlViewer'
import CommentsSection from '../shared/comment/CommentsSection'
import { ObjectType } from '../../lib/constants'
import { prependUrlWithProtocol } from '../../lib/utilities'
import ProjectDetailSectors from './ProjectDetailSectors'
import ProjectDetailOrganizations from './ProjectDetailOrganizations'
import ProjectDetailCountries from './ProjectDetailCountries'
import ProjectDetailTags from './ProjectDetailTags'
import ProjectDetailProducts from './ProjectDetailProduct'

const ProjectDetailRight = ({ project, canEdit, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slugNameMapping = (() => {
    const map = {}
    map[project.slug] = project.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='card-title text-dial-gray-dark'>{format('project.description')}</div>
      <HtmlViewer
        initialContent={project?.projectDescription?.description}
        editorId='project-detail'
      />
      <div className='card-title mb-3 text-dial-gray-dark'>{format('project.url')}</div>
      <div className='text-dial-blue text-sm pb-5'>
        <a href={prependUrlWithProtocol(project.projectWebsite)} target='_blank' rel='noreferrer'>
          {project.projectWebsite}
        </a>
      </div>
      <div className='mt-12'>
        <div className='card-title mb-3 text-dial-gray-dark'>{format('project.source')}</div>
        <div className='text-sm text-button-gray pb-5'>{project.origin.name}</div>
      </div>
      {project.organizations && <ProjectDetailOrganizations project={project} canEdit={canEdit} />}
      {project.products && <ProjectDetailProducts project={project} canEdit={canEdit} />}
      {project.sectors && <ProjectDetailSectors project={project} canEdit={canEdit} />}
      {project.countries && <ProjectDetailCountries project={project} canEdit={canEdit} />}
      {project.tags && <ProjectDetailTags project={project} canEdit={canEdit} />}
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={project.id}
        objectType={ObjectType.PROJECT}
      />
    </div>
  )
}

export default ProjectDetailRight
