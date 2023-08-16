import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { ObjectType } from '../../utils/constants'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { useUser } from '../../../../lib/hooks'
import CommentsSection from '../../shared/comment/CommentsSection'
import { prependUrlWithProtocol } from '../../utils/utilities'

const ProductDetailRight = ({ product, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !product.markdownUrl

  const editPath = `${product.slug}/edit`

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
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
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      {product.repository &&
        <div className='flex flex-col gap-y-3'>
          <div className='font-semibold text-dial-meadow'>
            {format('dataset.visualizationUrl')}
          </div>
          <div className='my-auto text-sm flex'>
            <a href={prependUrlWithProtocol(product.repository)} target='_blank' rel='noreferrer'>
              <div className='border-b border-dial-iris-blue line-clamp-1'>
                {product.repository} ⧉
              </div>
            </a>
          </div>
        </div>
      }
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      {product.submitterEmail &&
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
        </div>
      }
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={product.id}
        objectType={ObjectType.CANDIDATE_PRODUCT}
      />
    </div>
  )
}

export default ProductDetailRight
