import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { ObjectType } from '../utils/constants'
import DeleteOrganization from './fragments/DeleteOrganization'
import OrganizationDetailContacts from './fragments/OrganizationDetailContacts'
import OrganizationDetailCountries from './fragments/OrganizationDetailCountries'
import OrganizationDetailOffices from './fragments/OrganizationDetailOffices'
import OrganizationDetailProducts from './fragments/OrganizationDetailProducts'
import OrganizationDetailProjects from './fragments/OrganizationDetailProjects'

const OrganizationDetailRight = forwardRef(({ organization, editingAllowed, deletingAllowed }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={editPath} /> }
          { deletingAllowed && <DeleteOrganization organization={organization} /> }
        </div>
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='description-block'>
          <HtmlViewer
            initialContent={organization?.organizationDescription?.description}
            editorId='organization-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailOffices
            organization={organization}
            editingAllowed={editingAllowed}
            headerRef={officeRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailContacts
            organization={organization}
            editingAllowed={editingAllowed}
            headerRef={contactRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailProjects
            organization={organization}
            editingAllowed={editingAllowed}
            headerRef={projectRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailProducts
            organization={organization}
            editingAllowed={editingAllowed}
            headerRef={productRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <OrganizationDetailCountries
            organization={organization}
            editingAllowed={editingAllowed}
            headerRef={countryRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
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
