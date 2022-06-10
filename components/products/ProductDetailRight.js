import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useSession } from 'next-auth/client'
import { convertToKey } from '../context/FilterContext'
import SDGCard from '../sdgs/SDGCard'
import Breadcrumb from '../shared/breadcrumb'
import { DiscourseForum } from '../shared/discourse'
import EditButton from '../shared/EditButton'
import MaturityAccordion from './Maturity'
import ProductCard from './ProductCard'
import ProductDetailBuildingBlocks from './ProductDetailBuildingBlocks'
import ProductDetailProjects from './ProductDetailProjects'
import ProductDetailSectors from './ProductDetailSectors'
import ProductDetailOrganizations from './ProductDetailOrganizations'
import RepositoryList from './repositories/RepositoryList'
import ProductDetailTags from './ProductDetailTags'

const productsPath = convertToKey('Products')
const repositoriesPath = convertToKey('Repositories')

const ProductDetailRight = ({ product, discourseRef }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [session] = useSession()

  const canEdit = session?.user?.canEdit || session?.user?.own?.product?.id === product.id

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
      {
        product.website &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark inline'>{format('product.website')}</div>
            <div className='text-base text-dial-teal inline ml-3'>
              <a href={`//${product.website}`} className='mt-2' target='_blank' rel='noreferrer'>
                <div className='my-auto'>{product.website} ⧉</div>
              </a>
            </div>
          </div>
      }
      <div className='mt-8 card-title mb-3 text-dial-gray-dark'>{format('product.description')}
        {product.manualUpdate && (
          <div className='inline ml-5 h5'>{format('product.manualUpdate')}</div>
        )}
      </div>
      <div className='fr-view text-dial-gray-dark'>
        {product.productDescription && parse(product.productDescription.description)}
      </div>
      {
        product.sustainableDevelopmentGoals &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('sdg.header')}</div>
            {product.sustainableDevelopmentGoals.map((sdg, i) => {
              return (<SDGCard key={i} sdg={sdg} listType='list' />)
            })}
          </div>
      }
      {product.buildingBlocks && <ProductDetailBuildingBlocks product={product} canEdit={canEdit} />}
      {product.sectors && <ProductDetailSectors product={product} canEdit={canEdit} />}
      {product.organizations && <ProductDetailOrganizations product={product} canEdit={canEdit} />}
      {product.currentProjects && <ProductDetailProjects product={product} canEdit={canEdit} />}
      {product.tags && <ProductDetailTags product={product} canEdit={canEdit} />}
      <div className='mt-12 card-title mb-3 text-dial-gray-dark'>{format('product.source')}</div>
      <div className='grid grid-cols-3'>
        <div className='pb-5 pr-5'>
          {product.origins.map((origin, i) => {
            return (
              <div key={i}>
                <img
                  src={'/images/origins/' + origin.slug + '.png'}
                  height='20px' width='20px' className='inline'
                  alt={format('image.alt.logoFor', { name: origin.name })}
                />
                <div key={i} className='inline ml-2 text-sm'>{origin.name}</div>
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
                  <img
                    alt={format('image.alt.logoFor', { name: endorser.name })}
                    data-tip={format('product.endorsed-by')}
                    src={'/images/origins/' + endorser.slug + '.png'}
                    height='20px' width='20px' className='inline'
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
      <div className='mt-12'>
        <div className='card-title mb-3 text-dial-gray-dark'>{format('product.maturity-scores')}</div>
        {
          product.maturityScore
            ? (
              <>
                <div className='text-sm mb-3 text-dial-gray-dark highlight-link' dangerouslySetInnerHTML={{ __html: format('product.maturity-desc') }} />
                <MaturityAccordion maturityScores={product.maturityScores} overallScore={product.maturityScore} />
              </>
            )
            : <div className='text-sm pb-5 text-button-gray'>{format('product.no-maturity')}</div>
        }
      </div>
      <div className='mt-12' ref={discourseRef}>
        <div className='card-title mb-3 text-dial-gray-dark'>{format('product.discussion')}</div>
        <div className='text-sm text-dial-gray-dark pb-2 highlight-link' dangerouslySetInnerHTML={{ __html: format('product.forum-desc-prod') }} />
        <DiscourseForum topicId={product.discourseId} objType='prod' />
      </div>
    </div>
  )
}

export default ProductDetailRight
