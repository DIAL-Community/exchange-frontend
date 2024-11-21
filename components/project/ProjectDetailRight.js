import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { ObjectType } from '../utils/constants'
import DeleteProject from './fragments/DeleteProject'
import ProjectDetailCountries from './fragments/ProjectDetailCountries'
import ProjectDetailOrganizations from './fragments/ProjectDetailOrganizations'
import ProjectDetailProducts from './fragments/ProjectDetailProducts'
import ProjectDetailSdgs from './fragments/ProjectDetailSdgs'
import ProjectDetailTags from './fragments/ProjectDetailTags'

const ProjectDetailRight = forwardRef(({ project, editingAllowed, deletingAllowed }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const organizationRef = useRef()
  const productRef = useRef()
  const countryRef = useRef()
  const sdgRef = useRef()
  const tagRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.product.header', ref: productRef },
      { value: 'ui.country.header', ref: countryRef },
      { value: 'ui.sdg.header', ref: sdgRef },
      { value: 'ui.tag.header', ref: tagRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${project.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={editPath} /> }
          { deletingAllowed && <DeleteProject project={project} /> }
        </div>
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={project?.projectDescription?.description}
            editorId='project-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProjectDetailOrganizations
            project={project}
            editingAllowed={editingAllowed}
            headerRef={organizationRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProjectDetailProducts
            project={project}
            editingAllowed={editingAllowed}
            headerRef={productRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProjectDetailCountries
            project={project}
            editingAllowed={editingAllowed}
            headerRef={countryRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProjectDetailSdgs
            project={project}
            editingAllowed={editingAllowed}
            headerRef={sdgRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProjectDetailTags
            project={project}
            editingAllowed={editingAllowed}
            headerRef={tagRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={project} objectType={ObjectType.PROJECT} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={project.id}
          objectType={ObjectType.PROJECT}
        />
      </div>
    </div>
  )
})

ProjectDetailRight.displayName = 'ProjectDetailRight'

export default ProjectDetailRight
