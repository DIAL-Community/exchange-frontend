import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import Breadcrumb from '../shared/breadcrumb'
import CommentsSection from '../shared/comment/CommentsSection'
import { ObjectType } from '../../lib/constants'
import ProjectDetailSectors from './ProjectDetailSectors'
import ProjectDetailOrganizations from './ProjectDetailOrganizations'
import ProjectDetailCountries from './ProjectDetailCountries'
import ProjectDetailTags from './ProjectDetailTags'
import ProjectDetailProducts from './ProjectDetailProduct'

const ProjectDetailRight = ({ project, canEdit, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

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
      <div className='fr-view text-dial-gray-dark text-sm'>
        <div className='card-title mb-3 text-dial-gray-dark'>{format('project.description')}</div>
        {project.projectDescription && parse(project.projectDescription.description)}
      </div>
      <div className='pb-5 pr-5 pt-4 text-ellipsis overflow-hidden'>
        <div className='h5 pb-1'>{format('project.url')}</div>
        <a className='text-dial-blue text-sm' href={`${project.projectWebsite}`} target='_blank' rel='noreferrer'>{project.projectWebsite}</a>
      </div>
      <div className='pb-5 pr-5'>
        <div className='h5 pb-1'>{format('project.source')}</div>
        <div className='inline text-sm'>{project.origin.name}</div>
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
