import { gql, useMutation, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import RepositoryDetail from '../RepositoryDetail'
import Breadcrumb from '../../shared/breadcrumb'

const REPOSITORY_QUERY = gql`
  query ProductRepository($slug: String!) {
    productRepository(slug: $slug) {
      id
      name
      slug
      description
      absoluteUrl
      mainRepository

      license

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

const DELETE_PRODUCT_REPOSITORY = gql`
  mutation DeleteProductRepository($slug: String!) {
    deleteProductRepository(slug: $slug) { slug }
  }
`

const RepositoryInformation = ({ productRepository }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const router = useRouter()
  const { data: session } = useSession()
  const [deleteProductRepository, { data }] = useMutation(DELETE_PRODUCT_REPOSITORY)

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push(`/products/${productRepository.product.slug}/repositories`)
      }, 2000)
    }
  }, [data])

  const slugNameMapping = (() => {
    const map = {}
    map[productRepository.product.slug] = productRepository.product.name
    map[productRepository.slug] = productRepository.name

    return map
  })()

  const handleEdit = () => {
    router.push(`${router.asPath}/edit`)
  }

  const handleDelete = () => {
    if (session?.user) {
      const { userEmail, userToken } = session.user
      deleteProductRepository({
        context: { headers: { Authorization: `${userEmail} ${userToken}` } },
        variables: {
          slug: productRepository.slug
        }
      })
    }
  }

  const currVersion = productRepository?.statisticalData?.data?.repository?.releases?.edges[0]
    ? productRepository.statisticalData.data.repository.releases.edges[0].node.name
    : null

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='pb-5 pr-5 grid grid-cols-2'>
        <div className='text-sm'>
          <div className='font-semibold'>{format('product.current-version')}</div>
          <div className='text-sm'>{currVersion || format('product.no-version-data')}</div>
        </div>
        <div>
          <div className='font-semibold'>{format('product.license')}</div>
          <div className='text-sm'>{productRepository.license}</div>
        </div>
      </div>
      <div className='text-sm font-semibold'>
        {format('productRepository.description')}
      </div>
      <div className='text-sm text-dial-gray-dark'>
        {parse(productRepository.description)}
      </div>
      <div className='w-full xl:w-4/5 mt-3 py-3 border-b border-gray-300'>
        <RepositoryDetail
          repositoryData={productRepository.statisticalData.data?.repository}
          languageData={productRepository.languageData.data?.repository}
        />
      </div>
      {
        (
          session?.user.canEdit ||
          session?.user.own.products.filter(p => `${p}` === `${productRepository.product.id}`).length > 0
        ) &&
          <div className='w-full xl:w-4/5 my-2 flex flex-row gap-2'>
            <button
              className='text-white bg-blue-400 hover:bg-blue-500 rounded py-2 px-4'
              onClick={handleEdit}
            >
              {format('productRepository.edit')}
            </button>
            <button
              className='text-dial-blue border-2 border-dial-blue-light rounded py-1 px-4'
              onClick={handleDelete}
            >
              {format('productRepository.delete')}
            </button>
            {data && <div className='my-auto text-emerald-500 ml-auto'>{format('productRepository.deleted')}</div>}
          </div>
      }
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
            {format('productRepository.loading.indicator')}
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
