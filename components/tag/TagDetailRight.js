import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, ObjectType } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import Share from '../shared/common/Share'
import Bookmark from '../shared/common/Bookmark'
import CommentsSection from '../shared/comment/CommentsSection'
import ProjectCard from '../project/ProjectCard'
import DatasetCard from '../dataset/DatasetCard'
import ProductCard from '../product/ProductCard'
import UseCaseCard from '../use-case/UseCaseCard'
import DeleteTag from './DeleteTag'

const TagDetailRight = forwardRef(({ tag }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const descRef = useRef()
  const datasetRef = useRef()
  const productRef = useRef()
  const projectRef = useRef()
  const useCaseRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.dataset.header', ref: datasetRef },
      { value: 'ui.product.header', ref: productRef },
      { value: 'ui.project.header', ref: projectRef },
      { value: 'ui.useCase.header', ref: useCaseRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${tag.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={editPath} />
            {isAdminUser && <DeleteTag tag={tag} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum pb-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={tag?.tagDescription?.description}
            editorId='tag-description'
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={datasetRef}>
            {format('ui.dataset.header')}
          </div>
          {tag?.datasets.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.dataset.label'),
                base: format('ui.tag.label')
              })}
            </div>
          }
          {tag?.datasets.length > 0 &&
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
              {tag?.datasets?.map((dataset, index) =>
                <div key={`dataset-${index}`}>
                  <DatasetCard
                    index={index}
                    dataset={dataset}
                    displayType={DisplayType.SMALL_CARD}
                  />
                </div>
              )}
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={productRef}>
            {format('ui.product.header')}
          </div>
          {tag?.products.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.product.label'),
                base: format('ui.tag.label')
              })}
            </div>
          }
          {tag.products.length > 0 &&
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
              {tag?.products?.map((product, index) =>
                <div key={`product-${index}`}>
                  <ProductCard
                    index={index}
                    product={product}
                    displayType={DisplayType.SMALL_CARD}
                  />
                </div>
              )}
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={projectRef}>
            {format('ui.project.header')}
          </div>
          <div className='flex flex-col gap-y-4'>
            {tag?.projects.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.project.label'),
                  base: format('ui.tag.label')
                })}
              </div>
            }
            {tag?.projects?.map((project, index) =>
              <div key={`project-${index}`}>
                <ProjectCard
                  index={index}
                  project={project}
                  displayType={DisplayType.SMALL_CARD}
                />
              </div>
            )}
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3'/>
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-blueberry pb-3' ref={useCaseRef}>
            {format('ui.useCase.header')}
          </div>
          {tag?.useCases.length <= 0 &&
            <div className='text-sm text-dial-stratos'>
              {format('ui.common.detail.noData', {
                entity: format('ui.useCase.label'),
                base: format('ui.tag.label')
              })}
            </div>
          }
          {tag?.useCases.length > 0 &&
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
              {tag?.useCases?.map((useCase, index) =>
                <div key={`useCase-${index}`}>
                  <UseCaseCard
                    index={index}
                    useCase={useCase}
                    displayType={DisplayType.SMALL_CARD}
                  />
                </div>
              )}
            </div>
          }
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='block lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={tag} objectType={ObjectType.TAG} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={tag.id}
          objectType={ObjectType.TAG}
        />
      </div>
    </div>
  )
})

TagDetailRight.displayName = 'TagDetailRight'

export default TagDetailRight
