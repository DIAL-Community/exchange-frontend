import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useUser } from '../../../../lib/hooks'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import EditButton from '../../shared/form/EditButton'

const ProductRepositoryRight = forwardRef(({ product, productRepository }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser)

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef }
  ]), [])

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        {canEdit &&
          <div className='flex gap-x-3 ml-auto'>
            <EditButton
              type='link'
              href={
                `/products/${product.slug}` +
                `/repositories/${productRepository.slug}/edit`
              }
            />
          </div>
        }
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={productRepository?.description}
            editorId='use-case-step-description'
          />
        </div>
      </div>
    </div>
  )
})

ProductRepositoryRight.displayName = 'ProductRepositoryRight'

export default ProductRepositoryRight
