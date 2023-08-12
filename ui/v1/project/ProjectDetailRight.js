import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType, REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import ProjectDetailTags from './fragments/ProjectDetailTags'
import DeleteProject from './DeleteProject'
import ProjectDetailOrganizations from './fragments/ProjectDetailOrganizations'
import ProjectDetailProducts from './fragments/ProjectDetailProducts'
import ProjectDetailCountries from './fragments/ProjectDetailCountries'

const ProjectDetailRight = forwardRef(({ project, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !project.markdownUrl

  const descRef = useRef()
  const organizationRef = useRef()
  const productRef = useRef()
  const countryRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.product.header', ref: productRef },
      { value: 'ui.country.header', ref: countryRef },
      { value: 'ui.tag.header', ref: tagRef }
    ],
    []
  )

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={`${REBRAND_BASE_PATH}/projects/${project.slug}/edit`} />
            {isAdminUser && <DeleteProject project={project} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={project?.projectDescription?.description}
            editorId='project-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <ProjectDetailOrganizations
          project={project}
          canEdit={canEdit}
          headerRef={organizationRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <ProjectDetailProducts
          project={project}
          canEdit={canEdit}
          headerRef={productRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <ProjectDetailCountries
          project={project}
          canEdit={canEdit}
          headerRef={countryRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <ProjectDetailTags
          project={project}
          canEdit={canEdit}
          headerRef={tagRef}
        />
      </div>
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={project.id}
        objectType={ObjectType.PROJECT}
      />
    </div>
  )
})

ProjectDetailRight.displayName = 'ProjectDetailRight'

export default ProjectDetailRight
