import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useUser } from '../../../../lib/hooks'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import EditButton from '../../shared/form/EditButton'
import ProductRepositoryStats from './fragments/ProductRepositoryStats'

const ProductRepositoryRight = forwardRef(({ product, productRepository }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser)

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.top', ref: descRef }
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
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='text-lg font-semibold text-dial-blueberry py-3'>
          {format('productRepository.absoluteUrl')}
        </div>
        <div className='flex gap-x-2 pb-3 text-dial-stratos text-sm'>
          <a
            href={productRepository.absoluteUrl}
            target='_blank'
            rel='noreferrer'
            className='flex border-b border-dial-iris-blue '>
            <div className='line-clamp-1'>
              {productRepository.absoluteUrl}
            </div>
          </a>
          ⧉
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        { productRepository.languageData.data && productRepository.statisticalData.data &&
          <ProductRepositoryStats
            languageData={productRepository.languageData}
            statisticalData={productRepository.statisticalData}
          />
        }
      </div>
    </div>
  )
})

ProductRepositoryRight.displayName = 'ProductRepositoryRight'

export default ProductRepositoryRight
