import { gql, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import Breadcrumb from '../../shared/breadcrumb'
import WorkflowCard from '../../workflows/WorkflowCard'
import BuildingBlockCard from '../../building-blocks/BuildingBlockCard'
import ProductCard from '../../products/ProductCard'
import ReactHtmlParser from 'react-html-parser'

import { descriptionByLocale } from '../../../lib/utilities'
import { useRouter } from 'next/router'

const USE_CASE_STEP_QUERY = gql`
  query ProductRepository($slug: String!) {
    productRepository(slug: $slug) {
      id
      name
      slug
      description
      absoluteUrl
      mainRepository
    }
  }
`

const ProductRepositoryInformation = ({ productRepository }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })
  const { locale } = useRouter()

  const slugNameMapping = (() => {
    const map = {}
    map[productRepository.product.slug] = productRepository.product.name
    map[productRepository.slug] = productRepository.name
    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='fr-view text-dial-gray-dark'>
        {ReactHtmlParser(descriptionByLocale(productRepository.productRepositoryDescriptions, locale))}
      </div>
    </div>
  )
}

const RepositoryDetail = ({ repositorySlug }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { loading, data } = useQuery(USE_CASE_STEP_QUERY, { variables: { slug: repositorySlug } })
  return (
    <>
      {
        loading &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm'>
            {format('step.loading.indicator')}
          </div>
      }
      {
        data && data.productRepository &&
          <ProductRepositoryInformation productRepository={data.productRepository} />
      }
    </>
  )
}

export default RepositoryDetail
