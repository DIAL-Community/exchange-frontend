import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useProductOwnerUser, useUser } from '../../../../lib/hooks'
import CommentsSection from '../../../shared/comment/CommentsSection'
import Bookmark from '../../../shared/common/Bookmark'
import Share from '../../../shared/common/Share'
import CreateButton from '../../../shared/form/CreateButton'
import EditButton from '../../../shared/form/EditButton'
import { HtmlViewer } from '../../../shared/form/HtmlViewer'
import { DisplayType, ObjectType } from '../../../utils/constants'
import DeleteProduct from '../../../product/DeleteProduct'
import ProductRepositoryCard from '../repository/ProductRepositoryCard'
import ProductDetailTags from './ProductDetailTags'
import ProductDetailCountries from './ProductDetailCountries'
import ProductDetailMaturityScores from './ProductDetailMaturityScores'
import ProductDetailOrganizations from './ProductDetailOrganizations'
import ProductDetailCategories from './ProductDetailCategories'
import ProductDetailExtraAttributes from './ProductDetailExtraAttributes'
import ProductDetailProjects from './ProductDetailProjects'
import ProductDetailProductStage from './ProductDetailProductStage'

const ProductDetailRight = forwardRef(({ product }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const { isProductOwner } = useProductOwnerUser(product)
  const canEdit = isAdminUser || isEditorUser || isProductOwner

  const descRef = useRef()
  const extraRef = useRef()
  const pricingRef = useRef()
  const organizationRef = useRef()
  const projectRef = useRef()
  const countryRef = useRef()
  const categoryRef = useRef()
  const tagRef = useRef()
  const commentsSectionRef = useRef()
  const productRepositoryRef = useRef()
  const productMaturityRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.product.extraAttributes', ref: extraRef },
      { value: 'ui.product.pricing.title', ref: pricingRef },
      { value: 'ui.organization.header', ref: organizationRef },
      { value: 'ui.softwareCategories.header', ref: categoryRef },
      { value: 'ui.country.header', ref: countryRef },
      { value: 'ui.project.header', ref: projectRef },
      { value: 'productRepository.header', ref: productRepositoryRef },
      { value: 'ui.maturityScore.header', ref: productMaturityRef },
      { value: 'ui.productRepository.header', ref: productRepositoryRef },
      { value: 'ui.tag.header', ref: tagRef },
      { value: 'ui.comment.label', ref: commentsSectionRef }
    ],
    []
  )

  const editPath = `${product.slug}/edit`

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className="flex flex-col gap-y-3">
        {canEdit && (
          <div className="flex gap-x-3 ml-auto">
            <EditButton type="link" href={editPath}/>
            {isAdminUser && <DeleteProduct product={product}/>}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {product?.softwareCategories?.map((category, index) =>
            <div
              key={`category-${index}`}
              className="rounded-full bg-health-blue uppercase shadow-none px-6 py-1 text-white text-xs"
            >
              <div key={index} className="line-clamp-1">{category.name}</div>
            </div>
          )}
        </div>
        <div className="text-xl text-health-blue font-semibold pb-3 pt-1">
          {product.name}
        </div>
        <div className="block" ref={descRef}>
          <HtmlViewer
            initialContent={product?.productDescription?.description}
            editorId="product-description"
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <ProductDetailExtraAttributes product={product} canEdit={canEdit} headerRef={extraRef} />
        <hr className="border-b border-health-gray my-3"/>
        <ProductDetailProductStage product={product} canEdit={canEdit} headerRef={extraRef} />
        <hr className="border-b border-health-gray my-3"/>
        <div className="text-health-blue text-xl font-semibold mt-6" ref={productMaturityRef}>
          {format('ui.maturityScore.header')}
        </div>
        <div className="text-sm italic">
          <div
            className="text-xs text-justify text-health-blue highlight-link"
            dangerouslySetInnerHTML={{ __html: format('health.maturity.description') }}
          />
        </div>
        <ProductDetailMaturityScores
          slug={product.slug}
          overallMaturityScore={product.overallMaturityScore}
          maturityScoreDetails={product.maturityScoreDetails}
        />
        <hr className="border-b border-health-gray my-3"/>
        <div className="flex flex-col gap-y-3">
          <ProductDetailCategories
            product={product}
            canEdit={canEdit}
            headerRef={categoryRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className="flex flex-col gap-y-3">
          <ProductDetailOrganizations
            product={product}
            canEdit={canEdit}
            headerRef={organizationRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className="flex flex-col gap-y-3">
          <ProductDetailCountries
            product={product}
            canEdit={canEdit}
            headerRef={countryRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className="flex flex-col gap-y-3">
          <ProductDetailProjects
            product={product}
            canEdit={canEdit}
            headerRef={projectRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-row gap-3">
            <div className="text-health-blue text-lg font-semibold" ref={productRepositoryRef}>
              {format('productRepository.header')}
            </div>
            {canEdit &&
              <div className="ml-auto">
                <CreateButton
                  label={format('app.create')}
                  type="link"
                  href={`/health/products/${product.slug}/repositories/create`}
                />
              </div>
            }
          </div>
          <div className="text-xs text-justify italic text-health-blue mb-2">
            {format('ui.product.overview.repository')}
          </div>
          {!product.mainRepository &&
            <div className="text-sm text-dial-stratos">
              {format('ui.common.detail.noData', {
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
        <hr className="border-b border-health-gray my-3"/>
        <div className="flex flex-col gap-y-3">
          <ProductDetailTags
            product={product}
            canEdit={canEdit}
            headerRef={tagRef}
          />
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className="flex flex-col gap-y-3">
          <div className="text-xl font-semibold text-health-blue pb-3" ref={pricingRef}>
            {format('ui.product.pricing.title')}
          </div>
          <div className="text-xs text-justify italic text-health-blue mb-2">
            {format('ui.product.overview.pricing')}
          </div>
          <div className="text-sm flex flex-row gap-2">
            {format('ui.product.pricing.hostingModel')}:
            <div className="font-semibold inline">
              {product.hostingModel || format('general.na')}
            </div>
          </div>
          <div className="text-sm flex flex-row gap-2">
            {format('ui.product.pricing.pricingModel')}:
            <div className="font-semibold inline">
              {product.pricingModel || format('general.na')}
            </div>
          </div>
          <div className="text-sm flex flex-row gap-2">
            {format('ui.product.pricing.detailPricing')}:
            <div className="inline">
              {product.pricingDetails
                ? <HtmlViewer
                  className="-mb-12"
                  initialContent={product?.pricingDetails}
                  editorId="pricing-details"
                />
                : <div className="font-semibold inline">
                  {format('general.na')}
                </div>
              }
            </div>
          </div>
        </div>
        <hr className="border-b border-health-gray my-3"/>
        <div className="lg:hidden flex flex-col gap-y-3">
          <Bookmark object={product} objectType={ObjectType.PRODUCT}/>
          <hr className="border-b border-dial-slate-200"/>
          <Share/>
          <hr className="border-b border-dial-slate-200"/>
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
