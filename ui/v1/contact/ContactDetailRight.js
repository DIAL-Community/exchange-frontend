import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, ObjectType, REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { useUser } from '../../../lib/hooks'
import OrganizationCard from '../organization/OrganizationCard'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteContact from './DeleteContact'

const ContactDetailRight = forwardRef(({ contact, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !contact.markdownUrl

  const descRef = useRef()
  const organizationRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.organization.header', ref: organizationRef }
    ],
    []
  )

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={`${REBRAND_BASE_PATH}/contacts/${contact.slug}/edit`} />
            {isAdminUser && <DeleteContact contact={contact} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='text-sm text-dial-stratos'>
          {contact.title}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={organizationRef}>
          {format('ui.organization.header')}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4'>
          {contact?.organizations?.map((organization, index) =>
            <div key={`organization-${index}`}>
              <OrganizationCard
                index={index}
                organization={organization}
                displayType={DisplayType.SMALL_CARD}
              />
            </div>
          )}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={contact.id}
        objectType={ObjectType.CONTACT}
      />
    </div>
  )
})

ContactDetailRight.displayName = 'ContactDetailRight'

export default ContactDetailRight
