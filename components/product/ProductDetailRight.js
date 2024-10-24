import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { EDITING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import CreateButton from '../shared/form/CreateButton'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { PRODUCT_POLICY_QUERY } from '../shared/query/product'
import { DisplayType, ObjectType } from '../utils/constants'
import DeleteProduct from './buttons/DeleteProduct'
import ProductDetailBuildingBlocks from './fragments/ProductDetailBuildingBlocks'
import ProductDetailCategories from './fragments/ProductDetailCategories'
import ProductDetailCountries from './fragments/ProductDetailCountries'
import ProductDetailMaturityScores from './fragments/ProductDetailMaturityScores'
import ProductDetailOrganizations from './fragments/ProductDetailOrganizations'
import ProductDetailResources from './fragments/ProductDetailResources'
import ProductDetailSdgs from './fragments/ProductDetailSdgs'
import ProductDetailTags from './fragments/ProductDetailTags'
import ProductCard from './ProductCard'
import ProductRepositoryCard from './repository/ProductRepositoryCard'

const ProductSource = ({ product, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const origins = product.origins?.filter(origin => {
    return origin.slug !== 'dpga' || (origin.slug === 'dpga' && product.endorsers.length > 0)
  })

  return (
    <div className='flex flex-col gap-y-3' ref={headerRef}>
      <div className='text-lg font-semibold text-dial-meadow'>
        {format('product.source')}
      </div>
      <div className='text-xs text-justify italic text-dial-stratos mb-2'>
        {format('ui.product.overview.source')}
      </div>
      <div className='flex flex-col gap-3'>
        {origins?.length <= 0 &&
          <div className='text-sm'>
            {format('product.noDataSource')}
          </div>
        }
        {origins.map((origin, i) => {
          return (
            <div key={i} className='flex flex-row gap-3'>
              <div className='block w-12 relative'>
                <img
                  className='object-contain'
                  src={'/images/origins/' + origin.slug + '.png'}
                  alt={format('image.alt.logoFor', { name: origin.name })}
                />
              </div>
              <div className='inline my-auto text-sm'>{origin.name}</div>
              {origin.slug === 'dpga' && (
                <a
                  href={`https://digitalpublicgoods.net/registry/${product.slug.replaceAll('_', '-')}`}
                  target='_blank'
                  rel='noreferrer'
                  className='my-auto'
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

const ProductEndorser = ({ product, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3' ref={headerRef}>
      <div className='text-lg font-semibold text-dial-meadow'>
        {format('product.endorsers')}
      </div>
      {product.endorsers?.length <= 0 &&
        <div className='text-sm'>
          {format('product.noEndorser')}
        </div>
      }
      {product.endorsers.map((endorser, i) => {
        return (
          <div key={i} className='flex flex-row gap-3'>
            <div className='min-w-[3rem]'>
              <img
                alt={format('image.alt.logoFor', { name: endorser.name })}
                data-tooltip-id='react-tooltip'
                data-tooltip-content={format('product.endorsed-by')}
                src={'/images/origins/' + endorser.slug + '.png'}
                className='w-12'
              />
            </div>
            <div className='text-sm whitespace-normal'>
              {format('product.endorsed-by') + endorser.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const ProductInteroperable = ({ product, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3' ref={headerRef}>
      <div className='text-lg font-semibold text-dial-meadow'>
        {format('product.interoperable')}
      </div>
      <div className='text-xs text-justify italic text-dial-stratos mb-2'>
        {format('ui.product.overview.interoperable')}
      </div>
      {product.interoperatesWith.length > 0
        ? (
          product.interoperatesWith.map((interoperateProd, index) => (
            <div key={index} className='pb-5 mr-6'>
              <ProductCard product={interoperateProd} displayType={DisplayType.SMALL_CARD} />
            </div>
          ))
        )
        : (
          <div className='text-sm text-dial-stratos'>
            {format('ui.common.detail.noData', {
              entity: 'interoperable product',
              base: format('ui.product.label')
            })}
          </div>
        )
      }
    </div>
  )
}

const ProductIncluded = ({ product, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3' ref={headerRef}>
      <div className='text-lg font-semibold text-dial-meadow'>
        {format('product.included')}
      </div>
      {product.includes.length > 0
        ? (
          product.includes.map((includeProduct, index) => (
            <div key={index} className='pb-5 mr-6'>
              <ProductCard product={includeProduct} displayType={DisplayType.SMALL_CARD} />
            </div>
          ))
        )
        : (
          <div className='text-sm text-dial-stratos'>
            {format('ui.common.detail.noData', {
              entity: 'included product',
              base: format('ui.product.label')
            })}
          </div>
        )
      }
    </div>
  )
}

const ProductDetailRight = forwardRef(({ product }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const extraRef = useRef()
  const pricingRef = useRef()
  const sdgRef = useRef()
  const buildingBlockRef = useRef()
  const resourceRef = useRef()
  const organizationRef = useRef()
  const countryRef = useRef()
  const categoryRef = useRef()
  const tagRef = useRef()
  const commentsSectionRef = useRef()
  const productRepositoryRef = useRef()
  const productSourceRef = useRef()
  const productEndorserRef = useRef()
  const productIncludedRef = useRef()
  const productInteroperableRef = useRef()
  const productMaturityRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.product.extraAttributes', ref: extraRef },
      { value: 'ui.product.pricing.title', ref: pricingRef },
      { value: 'ui.sdg.header', ref: sdgRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
      { value: 'ui.resource.header', ref:resourceRef },
      { value: 'ui.organization.header', ref: organizationRef },

      { value: 'productRepository.header', ref: productRepositoryRef },

      { value: 'product.source', ref: productSourceRef },
      { value: 'product.endorsers', ref: productEndorserRef },
      { value: 'product.interoperable', ref: productInteroperableRef },
      { value: 'product.included', ref: productIncludedRef },

      { value: 'ui.maturityScore.header', ref: productMaturityRef },

      { value: 'ui.productRepository.header', ref: productRepositoryRef },
      { value: 'ui.tag.header', ref: tagRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${product.slug}/edit`

  let editingAllowed = false
  const { error } = useQuery(PRODUCT_POLICY_QUERY, {
    variables: { slug: EDITING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (!error) {
    editingAllowed = true
  }

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex flex-col lg:flex-row gap-3'>
          {product.approvalStatus &&
            <div className='px-3 py-1 bg-purple-300 rounded'>
              <span className='text-sm'>{product.approvalStatus.name}</span>
            </div>
          }
          <div className='flex gap-x-3 ml-auto'>
            { editingAllowed && <EditButton type='link' href={editPath} /> }
            <DeleteProduct product={product} />
          </div>
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
        {product?.extraAttributes.length > 0 && (
          <>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <div className='flex flex-col gap-y-3'>
              <div className='text-xl font-semibold text-dial-meadow pb-3' ref={extraRef}>
                {format('ui.product.extraAttributes')}
              </div>
              {product.extraAttributes.map((attr, i) => {
                return (
                  <div key={i} className='flex flex-row gap-3 text-sm'>
                    {attr.name}: {attr.value}
                  </div>
                )}
              )}
            </div>
          </>
        )}
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='text-xl font-semibold text-dial-meadow pb-3' ref={pricingRef}>
            {format('ui.product.pricing.title')}
          </div>
          <div className='text-xs text-justify italic text-dial-stratos mb-2'>
            {format('ui.product.overview.pricing')}
          </div>
          <div className='text-sm flex flex-row gap-2'>
            {format('ui.product.pricing.hostingModel')}:
            <div className='font-semibold inline'>
              {product.hostingModel || format('general.na')}
            </div>
          </div>
          <div className='text-sm flex flex-row gap-2'>
            {format('ui.product.pricing.pricingModel')}:
            <div className='font-semibold inline'>
              {product.pricingModel || format('general.na')}
            </div>
          </div>
          <div className='text-sm flex flex-row gap-2'>
            {format('ui.product.pricing.detailPricing')}:
            <div className='inline'>
              {product.pricingDetails
                ? <HtmlViewer
                  className='-mb-12'
                  initialContent={product?.pricingDetails}
                  editorId='pricing-details'
                />
                : <div className='font-semibold inline'>
                  {format('general.na')}
                </div>
              }
            </div>
          </div>
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProductDetailSdgs
            product={product}
            editingAllowed={editingAllowed}
            headerRef={sdgRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProductDetailBuildingBlocks
            product={product}
            editingAllowed={editingAllowed}
            headerRef={buildingBlockRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProductDetailResources
            product={product}
            editingAllowed={editingAllowed}
            headerRef={resourceRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProductDetailOrganizations
            product={product}
            editingAllowed={editingAllowed}
            headerRef={organizationRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProductDetailCountries
            product={product}
            editingAllowed={editingAllowed}
            headerRef={countryRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProductDetailCategories
            product={product}
            editingAllowed={editingAllowed}
            headerRef={categoryRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='text-dial-meadow text-xl font-semibold'>
          {format('ui.product.details')}
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <div className='flex flex-row gap-3'>
            <div className='text-dial-meadow text-lg font-semibold' ref={productRepositoryRef}>
              {format('productRepository.header')}
            </div>
            {editingAllowed &&
              <div className='ml-auto'>
                <CreateButton
                  label={format('app.create')}
                  type='link'
                  href={`/products/${product.slug}/repositories/create`}
                />
              </div>
            }
          </div>
          <div className='text-xs text-justify italic text-dial-stratos mb-2'>
            {format('ui.product.overview.repository')}
          </div>
          {!product.mainRepository &&
          <div className='text-sm text-dial-stratos'>
            {format( 'ui.common.detail.noData', {
              entity: format('productRepository.label'),
              base: format('ui.product.label')
            })}
          </div>
          }
          {product.mainRepository &&
            <ProductRepositoryCard
              index={0}
              product={product}
              productRepository={product.mainRepository}
              displayType={DisplayType.LARGE_CARD}
            />
          }
        </div>
        <div className='border-b border-transparent my-2' />
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
          <ProductSource product={product} headerRef={productSourceRef} />
          <ProductEndorser product={product} headerRef={productEndorserRef}/>
        </div>
        <div className='border-b border-transparent my-2' />
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
          <ProductInteroperable product={product} headerRef={productInteroperableRef} />
          <ProductIncluded product={product} headerRef={productIncludedRef} />
        </div>
        <div className='text-dial-meadow text-xl font-semibold mt-6' ref={productMaturityRef}>
          {format('ui.maturityScore.header')}
        </div>
        <div className='text-sm italic'>
          <div
            className='text-xs text-justify text-dial-gray-dark highlight-link'
            dangerouslySetInnerHTML={{ __html: format('product.maturity.description') }}
          />
        </div>
        <div className='border-b border-transparent my-2' />
        <ProductDetailMaturityScores
          slug={product.slug}
          editingAllowed={editingAllowed}
          overallMaturityScore={product.overallMaturityScore}
          maturityScoreDetails={product.maturityScoreDetails}
        />
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <ProductDetailTags
            product={product}
            editingAllowed={editingAllowed}
            headerRef={tagRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={product} objectType={ObjectType.PRODUCT} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={product.id}
          objectType={ObjectType.PRODUCT}
        />
      </div>
    </div>
  )
})

ProductDetailRight.displayName = 'ProductDetailRight'

export default ProductDetailRight
