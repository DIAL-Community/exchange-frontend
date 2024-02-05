import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../../shared/comment/CommentsSection'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { CandidateActionType, ObjectType } from '../../utils/constants'
import { prependUrlWithProtocol } from '../../utils/utilities'
import ProductActionButton from './fragments/ProductActionButton'

const ProductDetailRight = forwardRef(({ product, refetch }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = isAdminUser || isEditorUser

  const editPath = `${product.slug}/edit`

  const commentsSectionRef = useRef()
  useImperativeHandle(ref, () => ([
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <ProductActionButton
              product={product}
              actionType={CandidateActionType.REJECT}
              refetch={refetch}
            />
            <ProductActionButton
              product={product}
              actionType={CandidateActionType.APPROVE}
              refetch={refetch}
            />
            <EditButton type='link' href={editPath} />
          </div>
        )}
        <div className='text-xl font-semibold text-dial-meadow py-3'>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={product?.description}
            editorId='product-description'
          />
        </div>
        {product.repository &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('product.repository')}
              </div>
              <div className='my-auto text-sm flex'>
                <a href={prependUrlWithProtocol(product.repository)} target='_blank' rel='noreferrer'>
                  <div className='border-b border-dial-iris-blue line-clamp-1 break-all'>
                    {product.repository}
                  </div>
                </a>
                &nbsp;⧉
              </div>
            </div>
          </>
        }
        {product.submitterEmail &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-dial-meadow'>
                {format('ui.candidate.submitter')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${product.submitterEmail}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {product.submitterEmail}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.submittedOn')}:</span>
                <FormattedDate value={product.createdAt} />
              </div>
            </div>
          </>
        }
        {`${product.rejected}` === 'true' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-red-700'>
                {format('ui.candidate.rejectedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${product.rejectedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {product.rejectedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.rejectedOn')}:</span>
                <FormattedDate value={product.rejectedDate} />
              </div>
            </div>
          </>
        }
        {`${product.rejected}` === 'false' &&
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='font-semibold text-green-700'>
                {format('ui.candidate.approvedBy')}
              </div>
              <div className='my-auto text-sm flex'>
                <a
                  className='border-b border-dial-iris-blue'
                  href={`mailto:${product.approvedBy}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  {product.approvedBy}
                </a>
              </div>
              <div className='text-xs italic'>
                <span className='pr-[2px]'>{format('ui.candidate.approvedOn')}:</span>
                <FormattedDate value={product.approvedDate} />
              </div>
            </div>
          </>
        }
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={product} objectType={ObjectType.CANDIDATE_PRODUCT} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={product.id}
          objectType={ObjectType.CANDIDATE_PRODUCT}
        />
      </div>
    </div>
  )
})

ProductDetailRight.displayName = 'ProductDetailRight'

export default ProductDetailRight
