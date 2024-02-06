import { useIntl } from 'react-intl'
import { FaArrowRightLong } from 'react-icons/fa6'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { useUser } from '../../lib/hooks'
import Share from '../shared/common/Share'
import Bookmark from '../shared/common/Bookmark'
import CommentsSection from '../shared/comment/CommentsSection'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import DeleteSync from './DeleteSync'

const SyncDetailRight = forwardRef(({ sync }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const descRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${sync.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteSync sync={sync} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='text-sm text-dial-stratos'>
          <HtmlViewer
            initialContent={sync?.description}
            editorId='workflow-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-plum py-3'>
            {format('ui.sync.direction')}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            {sync.tenantSource}
            <FaArrowRightLong className='my-auto' />
            {sync.tenantDestination}
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-plum py-3'>
            {format('ui.sync.synchronizedModels')}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            {sync.syncConfiguration['models'].join(', ')}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={sync} objectType={ObjectType.SYNC} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={sync.id}
          objectType={ObjectType.SYNC}
        />
      </div>
    </div>
  )
})

SyncDetailRight.displayName = 'SyncDetailRight'

export default SyncDetailRight
