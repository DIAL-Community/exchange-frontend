import { gql, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import RepositoryCard from './RepositoryCard'

const REPOSITORIES_QUERY = gql`
  query ProductRepositories($slug: String!) {
    productRepositories(slug: $slug) {
      id
      name
      slug
      description
      mainRepository
      absoluteUrl
      statisticalData
      product {
        id
        name
        slug
      }
    }
  }
`

const RepositoryList = ({ productSlug, repositorySlug, listStyle, shadowOnContainer }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { loading, data } = useQuery(REPOSITORIES_QUERY, {
    variables: {
      slug: productSlug
    }
  })

  return (
    <div className={`${shadowOnContainer ? 'shadow-xl' : ''} h-60 overflow-y-scroll`}>
      {
        loading &&
          <div className='absolute right-4 text-white bg-dial-gray-dark px-3 py-2 mt-2 rounded text-sm'>
            {format('productRepositories.loading.indicator')}
          </div>
      }
      {
        data &&
          data.productRepositories.map((productRepository, index) => (
            <RepositoryCard key={index} productRepository={productRepository} repositorySlug={repositorySlug} listStyle={listStyle} />
          ))
      }
    </div>
  )
}

export default RepositoryList
