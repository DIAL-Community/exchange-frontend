import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { ObjectType, REBRAND_BASE_PATH } from '../../utils/constants'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { useUser } from '../../../../lib/hooks'
import CommentsSection from '../../shared/comment/CommentsSection'

const OrganizationDetailRight = ({ organization, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !organization.markdownUrl

  const editPath = `${REBRAND_BASE_PATH}/candidate/organizations/${organization.slug}/edit`

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={organization?.description}
            editorId='organization-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={organization.id}
        objectType={ObjectType.ORGANIZATION}
      />
    </div>
  )
}

export default OrganizationDetailRight
