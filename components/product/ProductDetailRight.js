import { forwardRef, useCallback, useContext, useImperativeHandle, useRef, useState } from 'react'
import classNames from 'classnames'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FiEdit3 } from 'react-icons/fi'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../lib/ToastContext'
import { SiteSettingContext, SiteSettingDispatchContext } from '../context/SiteSettingContext'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import CreateButton from '../shared/form/CreateButton'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import HidableSection from '../shared/HidableSection'
import { UPDATE_SITE_SETTING_SECTION_SETTINGS } from '../shared/mutation/siteSetting'
import { DisplayType, ObjectType, ProductExtraAttributeNames } from '../utils/constants'
import DeleteProduct from './fragments/DeleteProduct'
import ProductDetailBuildingBlocks from './fragments/ProductDetailBuildingBlocks'
import ProductDetailCategories from './fragments/ProductDetailCategories'
import ProductDetailCountries from './fragments/ProductDetailCountries'
import ProductDetailMaturityScores from './fragments/ProductDetailMaturityScores'
import ProductDetailOrganizations from './fragments/ProductDetailOrganizations'
import ProductDetailResources from './fragments/ProductDetailResources'
import ProductDetailSdgs from './fragments/ProductDetailSdgs'
import ProductDetailTags from './fragments/ProductDetailTags'
import ProductExtraAttributeDefinitions from './fragments/ProductExtraAttributeDefinitions'
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

const ProductDetailRight = forwardRef(({ product, editingAllowed, deletingAllowed }, ref) => {
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
  const extraAttributesRef = useRef()
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
      { value: 'ui.resource.header', ref: resourceRef },
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

  // Toggle whether we are editing the page or not.
  const [editingSection, setEditingSection] = useState(false)

  const { sectionConfigurations } = useContext(SiteSettingContext)
  const { setSectionConfigurations } = useContext(SiteSettingDispatchContext)

  const shouldBeDisplayed = (toggleKey) => {
    const currentSections = sectionConfigurations[ObjectType.PRODUCT] ?? []

    return editingAllowed || currentSections.indexOf(toggleKey) === -1
  }

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)
  const [saveItemSettings, { reset }] = useMutation(UPDATE_SITE_SETTING_SECTION_SETTINGS, {
    onCompleted: (data) => {
      const { updateSiteSettingSectionSettings: response } = data
      if (response.siteSetting && response?.errors?.length === 0) {
        setSectionConfigurations(response.siteSetting.sectionConfigurations)
        showSuccessMessage(<FormattedMessage id='ui.section.save.success' />)
      } else {
        showFailureMessage(<FormattedMessage id='ui.section.save.failure' />)
      }
    },
    onError: () => {
      showFailureMessage(<FormattedMessage id='ui.section.save.failure' />)
      reset()
    }
  })

  // Toggle the editing context for the current page.
  const toggleEditing = () => {
    // Toggle the editing flag for the current page.
    setEditingSection(!editingSection)
    // Save the changes to the database.
    if (editingSection) {
      saveItemSettings({
        variables: {
          sectionConfigurations
        }
      })
    }
  }

  const extraAttributes = product.extraAttributes
    ? product.extraAttributes.filter(e => ProductExtraAttributeNames.indexOf(e.name) > -1)
    : []

  const editPath = `${product.slug}/edit`

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
            {editingAllowed && (
              <button
                type='button'
                onClick={toggleEditing}
                className={classNames(
                  'cursor-pointer bg-dial-iris-blue px-2 py-1 rounded text-white',
                  editingSection ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                )}
              >
                <FiEdit3 className='inline pb-0.5' />
                <span className='text-sm px-1'>
                  {editingSection
                    ? <FormattedMessage id='ui.section.save' />
                    : <FormattedMessage id='ui.section.edit' />
                  }
                </span>
              </button>
            )}
            {editingAllowed && <EditButton type='link' href={editPath} />}
            {deletingAllowed && <DeleteProduct product={product} />}
          </div>
        </div>
        {shouldBeDisplayed('description') && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex items-center py-3'>
              <div className='text-xl font-semibold text-dial-meadow' ref={descRef}>
                {format('ui.common.detail.description')}
              </div>
              <HidableSection
                objectKey='description'
                objectType={ObjectType.PRODUCT}
                disabled={!editingSection}
                displayed={editingAllowed}
              />
            </div>
            <div className={`description-block ${shouldBeDisplayed('description') ? 'opacity-100' : 'opacity-50'}`}>
              <HtmlViewer
                initialContent={product?.productDescription?.description}
                editorId='product-description'
              />
            </div>
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {extraAttributes.length > 0 && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex flex-col gap-y-3'>
              <div className='text-xl font-semibold text-dial-meadow pb-3' ref={extraRef}>
                {format('ui.product.extraAttributes')}
              </div>
              {extraAttributes.map((attr, i) => {
                return (
                  <div key={i} className='flex flex-row gap-3 text-sm'>
                    {attr.name}: {attr.value}
                  </div>
                )
              })}
            </div>
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('attributes') && (
          <div className='flex flex-col gap-y-3'>
            <ProductExtraAttributeDefinitions
              product={product}
              editingSection={editingSection}
              editingAllowed={editingAllowed}
              headerRef={extraAttributesRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('sdgs') && (
          <div className='flex flex-col gap-y-3'>
            <ProductDetailSdgs
              product={product}
              editingSection={editingSection}
              editingAllowed={editingAllowed}
              headerRef={sdgRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('buildingBlocks') && (
          <div className='flex flex-col gap-y-3'>
            <ProductDetailBuildingBlocks
              product={product}
              editingSection={editingSection}
              editingAllowed={editingAllowed}
              headerRef={buildingBlockRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('resources') && (
          <div className='flex flex-col gap-y-3'>
            <ProductDetailResources
              product={product}
              editingSection={editingSection}
              editingAllowed={editingAllowed}
              headerRef={resourceRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('organizations') && (
          <div className='flex flex-col gap-y-3'>
            <ProductDetailOrganizations
              product={product}
              editingSection={editingSection}
              editingAllowed={editingAllowed}
              headerRef={organizationRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('countries') && (
          <div className='flex flex-col gap-y-3'>
            <ProductDetailCountries
              product={product}
              editingSection={editingSection}
              editingAllowed={editingAllowed}
              headerRef={countryRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('categories') && (
          <div className='flex flex-col gap-y-3'>
            <ProductDetailCategories
              product={product}
              editingSection={editingSection}
              editingAllowed={editingAllowed}
              headerRef={categoryRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('repositories') && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex flex-row gap-3'>
              <div className='text-dial-meadow text-lg font-semibold' ref={productRepositoryRef}>
                {format('productRepository.header')}
              </div>
              {editingAllowed &&
                <>
                  <HidableSection
                    objectKey='repositories'
                    objectType={ObjectType.PRODUCT}
                    disabled={!editingSection}
                    displayed={editingAllowed}
                  />
                  <CreateButton
                    label={format('app.create')}
                    type='link'
                    href={`/products/${product.slug}/repositories/create`}
                  />
                </>
              }
            </div>
            <div className='text-xs text-justify italic text-dial-stratos mb-2'>
              {format('ui.product.overview.repository')}
            </div>
            {!product.mainRepository &&
              <div className='text-sm text-dial-stratos'>
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
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('sources') && (
          <div className='relative'>
            <div className='absolute right-0'>
              <HidableSection
                objectKey='sources'
                objectType={ObjectType.PRODUCT}
                disabled={!editingSection}
                displayed={editingAllowed}
              />
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
              <ProductSource product={product} headerRef={productSourceRef} />
              <ProductEndorser product={product} headerRef={productEndorserRef} />
            </div>
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('relationships') && (
          <div className='relative'>
            <div className='absolute right-0'>
              <HidableSection
                objectKey='relationships'
                objectType={ObjectType.PRODUCT}
                disabled={!editingSection}
                displayed={editingAllowed}
              />
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-12 xl:gap-y-0'>
              <ProductInteroperable product={product} headerRef={productInteroperableRef} />
              <ProductIncluded product={product} headerRef={productIncludedRef} />
            </div>
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('maturity') && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex flex-row gap-3'>
              <div className='text-dial-meadow text-xl font-semibold' ref={productMaturityRef}>
                {format('ui.maturityScore.header')}
              </div>
              {editingAllowed &&
                <HidableSection
                  objectKey='maturity'
                  objectType={ObjectType.PRODUCT}
                  disabled={!editingSection}
                  displayed={editingAllowed}
                />
              }
            </div>
            <div className='text-sm italic'>
              <div
                className='text-xs text-justify text-dial-gray-dark highlight-link'
                dangerouslySetInnerHTML={{ __html: format('product.maturity.description') }}
              />
            </div>
            <div className='border-b border-transparent my-2' />
            <div className='flex flex-col gap-y-3'>
              <ProductDetailMaturityScores
                slug={product.slug}
                editingAllowed={editingAllowed}
                overallMaturityScore={product.overallMaturityScore}
                maturityScoreDetails={product.maturityScoreDetails}
              />
              <hr className='border-b border-dial-blue-chalk my-3' />
            </div>
          </div>
        )}
        {shouldBeDisplayed('pricing') && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex items-center pb-3'>
              <div className='text-xl font-semibold text-dial-meadow' ref={pricingRef}>
                {format('ui.product.pricing.title')}
              </div>
              <HidableSection
                objectKey='pricing'
                objectType={ObjectType.PRODUCT}
                disabled={!editingSection}
                displayed={editingAllowed}
              />
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
            </div>
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
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('tags') && (
          <div className='flex flex-col gap-y-3'>
            <ProductDetailTags
              product={product}
              editingSection={editingSection}
              editingAllowed={editingAllowed}
              headerRef={tagRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={product} objectType={ObjectType.PRODUCT} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
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
