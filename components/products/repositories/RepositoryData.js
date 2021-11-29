import { gql, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import Breadcrumb from '../../shared/breadcrumb'
import ReactHtmlParser from 'react-html-parser'

import RepositoryDetail from '../RepositoryDetail'

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

const RepositoryInformation = ({ productRepository }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

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
      <div className='text-sm font-semibold'>
        {format('productRepository.description')}
      </div>
      <div className='text-sm text-dial-gray-dark'>
        {ReactHtmlParser(productRepository.description)}
      </div>
      <div className='w-full xl:w-4/5 mt-3 py-3 border-b border-gray-300'>
        <RepositoryDetail
          repositoryData={productRepository.statisticalData.data?.repository}
          languageData={productRepository.languageData.data?.repository}
        />
      </div>
    </div>
  )
}

const RepositoryData = ({ repositorySlug, autoLoadData }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { loading, data } = useQuery(REPOSITORY_QUERY, {
    variables: { slug: repositorySlug },
    skip: !autoLoadData
  })

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
          <RepositoryInformation productRepository={data.productRepository} />
      }
    </>
  )
}

export default RepositoryData
