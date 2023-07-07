import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import WorkflowCard from '../workflow/WorkflowCard'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import BuildingBlockCard from '../building-block/BuildingBlockCard'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import CreateButton from '../shared/form/CreateButton'
import ProductDetailSdgTargets from './fragments/ProductDetailSdgTargets'
import ProductDetailTags from './fragments/ProductDetailSdgTags'
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
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={product?.productDescription?.description}
            editorId='product-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk'/>
      <div className='flex flex-col gap-y-3'>
        <div className='flex flex-row py-3' ref={stepRef}>
          <div className='text-xl font-semibold text-dial-blueberry '>
            {format('ui.product.detail.steps')}
          </div>
          {canEdit &&
            <CreateButton
              type='link'
              className='ml-auto'
              label={format('app.create')}
              href={
                `${REBRAND_BASE_PATH}` +
                `/products/${product.slug}` +
                '/product-steps/create'
              }
            />
          }
        </div>
        <div className='flex flex-col gap-y-3'>
          {product?.productSteps?.map((productStep, index) =>
            <Link
              key={index}
              href={
                `${REBRAND_BASE_PATH}` +
                `/products/${product.slug}` +
                `/product-steps/${productStep.slug}`
              }
            >
              <div className='rounded-md bg-dial-cotton flex'>
                <div className='flex flex-col gap-y-3 text-dial-blueberry px-6 py-4'>
                  <div className='text-base'>
                    {`${index + 1}. ${productStep.name}`}
                  </div>
                  <div className='flex gap-x-2 text-xs text-dial-stratos'>
                    <div className='text-sm'>
                      {format('ui.workflow.header')} ({productStep.workflows?.length ?? 0})
                    </div>
                    <div className='border border-r border-dial-slate-300' />
                    <div className='text-sm'>
                      {format('ui.buildingBlock.header')} ({productStep.buildingBlocks?.length ?? 0})
                    </div>
                    <div className='border border-r border-dial-slate-300' />
                    <div className='text-sm'>
                      {format('ui.product.header')} ({productStep.product?.length ?? 0})
                    </div>
                  </div>
                </div>
                <FaArrowRight className='ml-auto mr-3 my-auto' />
              </div>
            </Link>
          )}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={workflowRef}>
          {format('ui.workflow.header')}
        </div>
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          {product?.workflows?.map((workflow, index) =>
            <div key={`workflow-${index}`}>
              <WorkflowCard
                index={index}
                workflow={workflow}
                displayType={DisplayType.SMALL_CARD}
              />
            </div>
          )}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <ProductDetailSdgTargets product={product} canEdit={canEdit} headerRef={sdgTargetRef}/>
      </div>
      <hr className='bg-dial-blue-chalk mt-6'/>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-blueberry py-3' ref={buildingBlockRef}>
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
