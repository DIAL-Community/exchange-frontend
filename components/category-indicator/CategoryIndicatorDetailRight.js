import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { ObjectType } from '../utils/constants'
import DeleteCategoryIndicator from './fragments/DeleteCategoryIndicator'

const CategoryIndicatorDetailRight = forwardRef(({ categoryIndicator, editingAllowed, deletingAllowed }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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

  const editPath = `${categoryIndicator.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          { editingAllowed && <EditButton type='link' href={editPath} /> }
          { deletingAllowed && <DeleteCategoryIndicator categoryIndicator={categoryIndicator} /> }
        </div>
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={categoryIndicator?.categoryIndicatorDescription?.description}
            editorId='rubric-category-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3 text-sm'>
          <div className='text-xl font-semibold text-dial-plum'>
            {format('categoryIndicator.dataSource')}
          </div>
          {categoryIndicator?.dataSource}
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3 text-sm'>
          <div className='text-xl font-semibold text-dial-plum'>
            {format('categoryIndicator.weight')}
          </div>
          {categoryIndicator?.weight}
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3 text-sm'>
          <div className='text-xl font-semibold text-dial-plum'>
            {format('categoryIndicator.indicatorType')}
          </div>
          {categoryIndicator?.indicatorType}
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3 text-sm'>
          <div className='text-xl font-semibold text-dial-plum'>
            {format('categoryIndicator.scriptName')}
          </div>
          {categoryIndicator?.scriptName ?? format('general.na')}
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={categoryIndicator} objectType={ObjectType.CATEGORY_INDICATOR} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={categoryIndicator.id}
          objectType={ObjectType.CATEGORY_INDICATOR}
        />
      </div>
    </div>
  )
})

CategoryIndicatorDetailRight.displayName = 'CategoryIndicatorDetailRight'

export default CategoryIndicatorDetailRight
