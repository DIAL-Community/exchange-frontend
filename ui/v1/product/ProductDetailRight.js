import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import BuildingBlockCard from '../building-block/BuildingBlockCard'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import ProductDetailTags from './fragments/ProductDetailTags'
import DeleteProduct from './DeleteProduct'

const ProductDetailRight = forwardRef(({ product }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !product.markdownUrl

  const descRef = useRef()
  const stepRef = useRef()
  const workflowRef = useRef()
  const sdgTargetRef = useRef()
  const buildingBlockRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef },
    { value: 'ui.product.detail.steps', ref: stepRef },
    { value: 'ui.workflow.header', ref: workflowRef },
    { value: 'ui.sdgTarget.header', ref: sdgTargetRef },
    { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
    { value: 'ui.tag.header', ref: tagRef }
  ]), [])

  return (
    <div className='flex flex-col gap-y-4 py-4'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          {canEdit &&
            <EditButton
              type='link'
              href={`${REBRAND_BASE_PATH}/products/${product.slug}/edit`}
            />
          }
          {isAdminUser && <DeleteProduct product={product} />}
        </div>
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={product?.productDescription?.description}
            editorId='product-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={buildingBlockRef}>
          {format('ui.buildingBlock.header')}
        </div>
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          {product?.buildingBlocks?.map((buildingBlock, index) =>
            <div key={`building-block-${index}`}>
              <BuildingBlockCard
                index={index}
                buildingBlock={buildingBlock}
                displayType={DisplayType.SMALL_CARD}
              />
            </div>
          )}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <ProductDetailTags product={product} canEdit={canEdit} headerRef={tagRef} />
      </div>
    </div>
  )
})

ProductDetailRight.displayName = 'ProductDetailRight'

export default ProductDetailRight
