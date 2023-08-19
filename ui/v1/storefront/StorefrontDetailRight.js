import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteStorefront from './DeleteStorefront'
import StorefrontDetailProducts from './fragments/StorefrontDetailProducts'
import StorefrontDetailCountries from './fragments/StorefrontDetailCountries'
import StorefrontDetailProjects from './fragments/StorefrontDetailProjects'
import StorefrontDetailContacts from './fragments/StorefrontDetailContacts'
import StorefrontDetailOffices from './fragments/StorefrontDetailOffices'

const StorefrontDetailRight = forwardRef(({ organization }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !organization.markdownUrl

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
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteStorefront organization={organization} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={organization?.organizationDescription?.description}
            editorId='organization-description'
          />
        </div>
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <StorefrontDetailOffices
          organization={organization}
          canEdit={canEdit}
          headerRef={officeRef}
        />
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <StorefrontDetailContacts
          organization={organization}
          canEdit={canEdit}
          headerRef={contactRef}
        />
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <StorefrontDetailProjects
          organization={organization}
          canEdit={canEdit}
          headerRef={projectRef}
        />
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <StorefrontDetailProducts
          organization={organization}
          canEdit={canEdit}
          headerRef={productRef}
        />
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <StorefrontDetailCountries
          organization={organization}
          canEdit={canEdit}
          headerRef={countryRef}
        />
      </div>
      <hr className='border-b border-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={organization.id}
        objectType={ObjectType.ORGANIZATION}
      />
    </div>
  )
})

StorefrontDetailRight.displayName = 'StorefrontDetailRight'

export default StorefrontDetailRight
