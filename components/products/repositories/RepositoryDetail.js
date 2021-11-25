import { gql, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import Breadcrumb from '../../shared/breadcrumb'
import WorkflowCard from '../../workflows/WorkflowCard'
import BuildingBlockCard from '../../building-blocks/BuildingBlockCard'
import ProductCard from '../../products/ProductCard'
import ReactHtmlParser from 'react-html-parser'

import RepositoryData from '../RepositoryDetail'

import { descriptionByLocale } from '../../../lib/utilities'
import { useRouter } from 'next/router'

const REPOSITORY_QUERY = gql`
  query ProductRepository($slug: String!) {
    productRepository(slug: $slug) {
      id
      name
      slug
      description
      absoluteUrl
      mainRepository

      languageData
      statisticalData

      product {
        id
        name
        slug
      }
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
        {ReactHtmlParser(productRepository.description)}
      </div>
      <div className='w-full xl:w-3/5 mt-4'>
        <RepositoryData
          repositoryData={productRepository.statisticalData.data.repository}
          languageData={productRepository.languageData.data.repository}
        />
      </div>
    </div>
  )
}

const RepositoryDetail = ({ repositorySlug }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { loading, data } = useQuery(REPOSITORY_QUERY, { variables: { slug: repositorySlug } })
  return (
    <>
      {
        loading &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm'>
            {format('repository.loading.indicator')}
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
