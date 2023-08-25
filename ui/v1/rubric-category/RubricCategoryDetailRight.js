import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../utils/constants'
import CommentsSection from '../shared/comment/CommentsSection'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import EditButton from '../shared/form/EditButton'
import DeleteRubricCategory from './DeleteRubricCategory'

const RubricCategoryDetailRight = forwardRef(({ rubricCategory }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const descRef = useRef()
  const categoryIndicatorRef = useRef()
  const commentsSectionRef = useRef()
  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'categoryIndicator.header', ref: categoryIndicatorRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${rubricCategory.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteRubricCategory rubricCategory={rubricCategory} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={rubricCategory?.rubricCategoryDescription?.description}
            editorId='rubric-category-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={rubricCategory.id}
          objectType={ObjectType.SDG}
        />
      </div>
    </div>
  )
})

RubricCategoryDetailRight.displayName = 'RubricCategoryDetailRight'

export default RubricCategoryDetailRight
