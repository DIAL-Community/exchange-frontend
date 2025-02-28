import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import Select from '../../../shared/form/Select'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { PRODUCT_REPOSITORIES_QUERY } from '../../../shared/query/productRepository'

const ProductRepositoryDetailNav = ({ product, scrollRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { loading, error, data } = useQuery(PRODUCT_REPOSITORIES_QUERY, {
    variables: { productSlug: product.slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }

  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError()
  } else if (!data?.productRepositories) {
    return handleMissingData()
  }

  const { productRepositories } = data

  let productRepositoryNavOptions = []
  if (productRepositories) {
    productRepositoryNavOptions = productRepositories.map((productRepository) => {
      return {
        label: <div className='px-2'>{productRepository.name}</div>,
        value: `ui.product.detail.repositories.${productRepository.slug}`
      }
    })
  }

  const navOptions = [ {
    label: format('ui.product.parent.detail'),
    value: 'ui.product.parent.detail'
  }, {
    label: format('ui.common.detail.top'),
    value: 'ui.common.detail.top'
  }, ...productRepositoryNavOptions]

  const onNavigationChange = (selectedNav) => {
    const { value } = selectedNav
    if (value.indexOf('ui.product.detail.repositories.') >= 0) {
      const destinationSlug = value.replace('ui.product.detail.repositories.', '')
      const destinationRoute =
        `/products/${product.slug}` +
        `/repositories/${destinationSlug}`
      router.push(destinationRoute)
    } else if (value.indexOf('ui.product.parent.detail') >= 0) {
      const destinationRoute = `/products/${product.slug}`
      router.push(destinationRoute)
    } else if (scrollRef && scrollRef.current) {
      const scrollTargetRef = scrollRef.current.find(ref => ref.value === value)
      scrollTargetRef?.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const fetchOptions = async (input) => {
    return navOptions.filter(({ label }) => label.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  }

  return (
    <div className='flex flex-col gap-y-3 text-sm py-3'>
      <div className='font-semibold text-dial-blueberry'>
        {format('ui.shared.jumpTo')}
      </div>
      <Select
        async
        isBorderless
        aria-label={format('ui.ribbon.nav.ariaLabel')}
        cacheOptions
        defaultOptions={navOptions}
        loadOptions={fetchOptions}
        onChange={onNavigationChange}
        value={null}
      />
    </div>
  )
}

export default ProductRepositoryDetailNav
