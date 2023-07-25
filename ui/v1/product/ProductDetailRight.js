import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { DisplayType, ObjectType, REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import ProductDetailTags from './fragments/ProductDetailTags'
import DeleteProduct from './DeleteProduct'
import ProductDetailBuildingBlocks from './fragments/ProductDetailBuildingBlocks'
import ProductDetailSdgs from './fragments/ProductDetailSdgs'
import ProductDetailOrganizations from './fragments/ProductDetailOrganizations'
import ProductCard from './ProductCard'
import ProductDetailMaturityScores from './fragments/ProductDetailMaturityScores'

const ProductSource = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>{format('product.source')}</div>
      <div className='flex flex-col gap-3'>
        {product.origins.map((origin, i) => {
          return (
            <div key={i} className='flex gap-2 my-auto relative'>
              <div className='flex flex-row gap-3'>
                <div className='block w-12 relative'>
                  <img
                    className='object-contain'
                    src={'/images/origins/' + origin.slug + '.png'}
                    alt={format('image.alt.logoFor', { name: origin.name })}
                  />
                </div>
                <div className='inline mt-0.5 text-sm'>{origin.name}</div>
              </div>
              {origin.slug === 'dpga' && product.endorsers.length === 0 && (
                <div className='inline ml-2 h5'>{format('product.nominee')}</div>
              )}
              {origin.slug === 'dpga' && (
                <a
                  href={`https://digitalpublicgoods.net/registry/${product.slug.replaceAll(
                    '_',
                    '-'
                  )}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  <div
                    className='inline text-dial-teal text-sm'
                    data-tooltip-id='react-tooltip'
                    data-tooltip-content={format('product.view-DPGA-data')}
                  >
                    <BsQuestionCircleFill className='inline text-xl fill-dial-sapphire' />
                  </div>
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ProductEndorser = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>{format('product.endorsers')}</div>
      {product.endorsers.map((endorser, i) => {
        return (
          <div key={i} className='flex gap-3'>
            <div className='block relative'>
              <img
                alt={format('image.alt.logoFor', { name: endorser.name })}
                data-tooltip-id='react-tooltip'
                data-tooltip-content={format('product.endorsed-by')}
                src={'/images/origins/' + endorser.slug + '.png'}
                className='object-contain w-16'
              />
            </div>
            <div className='text-sm inline'>{format('product.endorsed-by') + endorser.name}</div>
          </div>
        )
      })}
    </div>
  )
}

const ProductInteroperable = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>
        {format('product.interoperable')}
      </div>
      {product.interoperatesWith.length > 0 ? (
        product.interoperatesWith.map((interoperateProd, index) => (
          <div key={index} className='pb-5 mr-6'>
            <ProductCard product={interoperateProd} displayType={DisplayType.SMALL_CARD} />
          </div>
        ))
      ) : (
        <div className='text-sm text-dial-stratos'>
          {format('ui.common.detail.noData', {
            entity: 'interoperable product',
            base: format('ui.product.label')
          })}
        </div>
      )}
    </div>
  )
}

const ProductIncluded = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow'>{format('product.included')}</div>
      {product.includes.length > 0 ? (
        product.includes.map((includeProduct, index) => (
          <div key={index} className='pb-5 mr-6'>
            <ProductCard product={includeProduct} displayType={DisplayType.SMALL_CARD} />
          </div>
        ))
      ) : (
        <div className='text-sm text-dial-stratos'>
          {format('ui.common.detail.noData', {
            entity: 'included product',
            base: format('ui.product.label')
          })}
        </div>
      )}
    </div>
  )
}

const ProductDetailRight = forwardRef(({ product, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !product.markdownUrl

  const descRef = useRef()
  const pricingRef = useRef()
  const sdgRef = useRef()
  const buildingBlockRef = useRef()
  const organizationRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.product.pricing.title', ref: pricingRef },
      { value: 'ui.sdg.header', ref: sdgRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.tag.header', ref: tagRef }
    ],
    []
  )

  return (
    <div className='flex flex-col gap-y-4 py-4'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          {canEdit && (
            <EditButton type='link' href={`${REBRAND_BASE_PATH}/products/${product.slug}/edit`} />
          )}
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
      <hr className='bg-dial-blue-chalk mt-6' />
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-meadow py-3' ref={pricingRef}>
          {format('ui.product.pricing.title')}
        </div>
        <div className='text-sm'>
          {format('ui.product.pricing.hostingModel')}
        </div>
        <div className='text-sm'>
          {format('ui.product.pricing.pricingModel')}
        </div>
        <div className='text-sm'>
          {format('ui.product.pricing.detailPricing')}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <ProductDetailSdgs product={product} canEdit={canEdit} headerRef={sdgRef} />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <ProductDetailBuildingBlocks
          product={product}
          canEdit={canEdit}
          headerRef={buildingBlockRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <ProductDetailOrganizations
          product={product}
          canEdit={canEdit}
          headerRef={organizationRef}
        />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='flex flex-col gap-y-3'>
        <ProductDetailTags product={product} canEdit={canEdit} headerRef={tagRef} />
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <div className='text-dial-meadow text-xl font-semibold'>
        {format('ui.product.details')}
      </div>
      <div className='mt-6'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-y-12 xl:gap-y-0'>
          <ProductSource product={product} />
          <ProductEndorser product={product} />
        </div>
      </div>
      <div className='mt-6'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-y-12 xl:gap-y-0'>
          <ProductInteroperable product={product} />
          <ProductIncluded product={product} />
        </div>
      </div>
      <div className='text-dial-meadow text-xl font-semibold mt-6'>
        {format('ui.maturityScore.header')}
      </div>
      <div className='text-sm italic'>
        <div
          className='text-sm mb-3 text-dial-gray-dark highlight-link'
          dangerouslySetInnerHTML={{ __html: format('product.maturity-desc') }}
        />
      </div>
      <div className='mt-6'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-y-12 xl:gap-y-0'>
          <div className='flex flex-col'>
            <div className='text-dial-meadow text-center'>
              Overall Maturity Score
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='text-dial-meadow text-center'>
              Overall Maturity Score
            </div>
            <div>
              <ProductDetailMaturityScores
                slug={product.slug}
                overallMaturityScore={product.overallMaturityScore}
                maturityScoreDetails={product.maturityScoreDetails}
              />
            </div>
          </div>
        </div>
      </div>
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={product.id}
        objectType={ObjectType.PRODUCT}
      />
    </div>
  )
})

ProductDetailRight.displayName = 'ProductDetailRight'

export default ProductDetailRight
