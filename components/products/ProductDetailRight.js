import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import CommentsSection from '../shared/comment/CommentsSection'
import { ObjectType } from '../../lib/constants'
import { useProductOwnerUser, useUser } from '../../lib/hooks'
import { prependUrlWithProtocol } from '../../lib/utilities'
import ProductCard from './ProductCard'
import ProductDetailBuildingBlocks from './ProductDetailBuildingBlocks'
import ProductDetailProjects from './ProductDetailProjects'
import ProductDetailSectors from './ProductDetailSectors'
import ProductDetailOrganizations from './ProductDetailOrganizations'
import RepositoryList from './repositories/RepositoryList'
import ProductDetailTags from './ProductDetailTags'
import ProductDetailSdgs from './ProductDetailSdgs'
import ProductPricing from './ProductPricing'
import ProductDetailLanguages from './ProductDetailLanguages'
import ProductDetailMaturityScores from './ProductDetailMaturityScores'

const ProductDetailRight = ({ product, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, loadingUserSession } = useUser()
  const { isProductOwner } = useProductOwnerUser(product, [], loadingUserSession || isAdminUser)
  const canEdit = isAdminUser || isProductOwner

  const slugNameMapping = (() => {
    const map = {}
    map[product.slug] = product.name

    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      {product.website &&
        <div className='mt-8 mb-3 flex flex-col gap-3'>
          <div className='card-title text-dial-gray-dark inline'>{format('product.website')}</div>
          <div className='text-base text-dial-teal'>
            <a href={prependUrlWithProtocol(product.website)} target='_blank' rel='noreferrer'>
              <div className='my-auto'>{product.website} ⧉</div>
            </a>
          </div>
        </div>
      }
      <div className='mt-8 flex flex-col gap-3 mb-3'>
        <div className='card-title text-dial-gray-dark inline'>{format('product.license')}</div>
        <div className='text-base text-sm'>
          {
            product.commercialProduct
              ? format('product.pricing.commercial').toUpperCase()
              : (product.mainRepository?.license || format('general.na')).toUpperCase()
          }
        </div>
      </div>
      <div className='mt-8 card-title mb-3 text-dial-gray-dark'>{format('product.description')}
        {product.manualUpdate && (
          <div className='inline ml-5 h5'>{format('product.manualUpdate')}</div>
        )}
      </div>
      <div className='fr-view text-dial-gray-dark'>
        {product.productDescription && parse(product.productDescription.description)}
      </div>
      <ProductPricing product={product} canEdit={false} />
      {product.sustainableDevelopmentGoals && <ProductDetailSdgs product={product} canEdit={canEdit} />}
      {product.buildingBlocks && <ProductDetailBuildingBlocks product={product} canEdit={isAdminUser} />}
      {product.sectors && <ProductDetailSectors product={product} canEdit={canEdit} />}
      {product.organizations && <ProductDetailOrganizations product={product} canEdit={canEdit} />}
      {product.currentProjects && <ProductDetailProjects product={product} canEdit={canEdit} />}
      {product.tags && <ProductDetailTags product={product} canEdit={canEdit} />}
      <div className='mt-12 card-title mb-3 text-dial-gray-dark'>{format('product.source')}</div>
      <div className='grid grid-cols-3'>
        <div className='pb-5 pr-5'>
          {product.origins.map((origin, i) => {
            return (
              <div key={i} className='flex gap-2 my-auto relative'>
                <div className='block w-8 relative'>
                  <Image
                    layout='fill'
                    objectFit='scale-down'
                    objectPosition='left'
                    src={'/images/origins/' + origin.slug + '.png'}
                    alt={format('image.alt.logoFor', { name: origin.name })}
                  />
                </div>
                <div key={i} className='inline mt-0.5 text-sm'>{origin.name}</div>
                {origin.slug === 'dpga' && product.endorsers.length === 0 && (
                  <div className='inline ml-2 h5'>{format('product.nominee')}</div>
                )}
                {origin.slug === 'dpga' && (
                  <a className='block ml-3' href={'https://digitalpublicgoods.net/registry/' + product.slug.replaceAll('_', '-')} target='_blank' rel='noreferrer'>
                    <div className='inline ml-4 text-dial-teal text-sm'>{format('product.view-DPGA-data')}</div>
                  </a>
                )}
              </div>
            )
          })}
        </div>
        <div className='pb-5 pr-5 col-span-2'>
          {product.endorsers.length > 0 && <div className='h5 pb-1'>{format('product.endorsers')}</div>}
          {product.endorsers.length > 0 && product.endorsers.map((endorser, i) => {
            return (
              <div key={i}>
                <div>
                  <Image
                    height={20} width={20}
                    alt={format('image.alt.logoFor', { name: endorser.name })}
                    data-tip={format('product.endorsed-by')}
                    src={'/images/origins/' + endorser.slug + '.png'}
                    className='inline'
                  />
                  <div key={i} className='text-sm inline ml-2'>{format('product.endorsed-by') + endorser.name}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='flex justify-between mt-12 mb-3'>
        <span className='text-dial-gray-dark border-b-2 border-transparent card-title'>
          {format('product.repository')}
        </span>
        {canEdit && (
          <EditButton
            type='link'
            href={product.mainRepository?.mainRepository
              ? `/products/${product.slug}/repositories/${product.mainRepository.slug}`
              : `/products/${product.slug}/repositories`}
          />
        )}
      </div>
      {product.languages && <ProductDetailLanguages languages={product.languages} />}
      <RepositoryList productSlug={product.slug} />
      <div className='mt-12 grid grid-cols-1 xl:grid-cols-2 gap-y-12 xl:gap-y-0'>
        <div>
          <div className='card-title mb-3 text-dial-gray-dark'>{format('product.interoperable')}</div>
          {
            (product.interoperatesWith.length > 0)
              ? product.interoperatesWith.map((interopProd, index) => {
                return (
                  <div key={index} className='pb-5 mr-6'>
                    <ProductCard product={interopProd} listType='list' />
                  </div>
                )
              })
              : (<div className='text-sm pb-5 text-button-gray'>{format('product.no-interop')}</div>)
          }
        </div>
        <div>
          <div className='card-title mb-3 text-dial-gray-dark'>{format('product.included')}</div>
          {
            (product.includes.length > 0)
              ? product.includes.map((includeProd, index) => {
                return (
                  <div key={index} className='pb-5 mr-6'>
                    <ProductCard product={includeProd} listType='list' />
                  </div>
                )
              })
              : (<div className='text-sm pb-5 text-button-gray'>{format('product.no-include')}</div>)
          }
        </div>
      </div>
      <ProductDetailMaturityScores slug={product.slug} maturityScore={product.maturityScore} maturityScoreDetails={product.maturityScoreDetails} />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={product.id}
        objectType={ObjectType.PRODUCT}
      />
    </div>
  )
}

export default ProductDetailRight
