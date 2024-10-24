import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { EDITING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import CategoryIndicatorCard from '../category-indicator/CategoryIndicatorCard'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import CreateButton from '../shared/form/CreateButton'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { RUBRIC_CATEGORY_QUERY } from '../shared/query/rubricCategory'
import { DisplayType, ObjectType } from '../utils/constants'
import DeleteRubricCategory from './buttons/DeleteRubricCategory'

const RubricCategoryDetailRight = forwardRef(({ rubricCategory }, ref) => {
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

  const editPath = `${rubricCategory.slug}/edit`

  let editingAllowed = true
  const { error } = useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { slug: EDITING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (error) {
    editingAllowed = false
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {editingAllowed && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            <DeleteRubricCategory rubricCategory={rubricCategory} />
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
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='flex flex-row pb-3' ref={categoryIndicatorRef}>
            <div className='text-xl font-semibold text-dial-blueberry '>
              {format('categoryIndicator.header')}
            </div>
            {editingAllowed &&
              <CreateButton
                type='link'
                className='ml-auto'
                label={format('app.create')}
                href={
                  `/rubric-categories/${rubricCategory.slug}` +
                  '/category-indicators/create'
                }
              />
            }
          </div>
          <div className='flex flex-col gap-y-3'>
            {rubricCategory?.categoryIndicators?.map((categoryIndicator, index) =>
              <div key={index}>
                <CategoryIndicatorCard
                  rubricCategory={rubricCategory}
                  categoryIndicator={categoryIndicator}
                  displayType={DisplayType.SMALL_CARD}
                />
              </div>
            )}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={rubricCategory} objectType={ObjectType.RUBRIC_CATEGORY} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={rubricCategory.id}
          objectType={ObjectType.RUBRIC_CATEGORY}
        />
      </div>
    </div>
  )
})

RubricCategoryDetailRight.displayName = 'RubricCategoryDetailRight'

export default RubricCategoryDetailRight
