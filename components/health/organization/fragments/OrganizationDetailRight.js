import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useOrganizationOwnerUser, useUser } from '../../../../lib/hooks'
import CommentsSection from '../../../shared/comment/CommentsSection'
import Bookmark from '../../../shared/common/Bookmark'
import Share from '../../../shared/common/Share'
import EditButton from '../../../shared/form/EditButton'
import { HtmlViewer } from '../../../shared/form/HtmlViewer'
import { ObjectType } from '../../../utils/constants'
import DeleteOrganization from '../../../organization/DeleteOrganization'
import OrganizationDetailContacts from './OrganizationDetailContacts'
import OrganizationDetailCountries from './OrganizationDetailCountries'
import OrganizationDetailOffices from './OrganizationDetailOffices'
import OrganizationDetailProducts from './OrganizationDetailProducts'
import OrganizationDetailProjects from './OrganizationDetailProjects'

const OrganizationDetailRight = forwardRef(({ organization }, ref) => {

  const { isAdminUser, isEditorUser } = useUser()
  const { isOrganizationOwner } = useOrganizationOwnerUser(organization)

  const canEdit = isAdminUser || isEditorUser || isOrganizationOwner

  const descRef = useRef()
  const officeRef = useRef()
  const contactRef = useRef()
  const projectRef = useRef()
  const productRef = useRef()
  const countryRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.office.header', ref: officeRef },
      { value: 'ui.contact.header', ref: contactRef },
      { value: 'ui.project.header', ref: projectRef },
      { value: 'ui.product.header', ref: productRef },
      { value: 'ui.country.header', ref: countryRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${organization.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteOrganization organization={organization} />}
          </div>
        )}
        <div className='text-xl font-semibold text-health-blue py-3' ref={descRef}>
          {organization.name}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={organization?.organizationDescription?.description}
            editorId='organization-description'
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailOffices
            organization={organization}
            canEdit={canEdit}
            headerRef={officeRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailContacts
            organization={organization}
            canEdit={canEdit}
            headerRef={contactRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailProjects
            organization={organization}
            canEdit={canEdit}
            headerRef={projectRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailProducts
            organization={organization}
            canEdit={canEdit}
            headerRef={productRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailCountries
            organization={organization}
            canEdit={canEdit}
            headerRef={countryRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={organization} objectType={ObjectType.ORGANIZATION} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={organization.id}
          objectType={ObjectType.ORGANIZATION}
        />
      </div>
    </div>
  )
})

OrganizationDetailRight.displayName = 'OrganizationDetailRight'

export default OrganizationDetailRight
