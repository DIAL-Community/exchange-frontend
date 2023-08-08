import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { ObjectType } from '../../utils/constants'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import CommentsSection from '../../shared/comment/CommentsSection'

const RoleDetailRight = ({ role, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-meadow py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={role?.description}
            editorId='role-description'
          />
        </div>
      </div>
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={role.id}
        objectType={ObjectType.ROLE}
      />
    </div>
  )
}

export default RoleDetailRight
