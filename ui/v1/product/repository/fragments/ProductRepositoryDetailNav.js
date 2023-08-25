import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Select from '../../../shared/form/Select'
import { PRODUCT_REPOSITORIES_QUERY } from '../../../shared/query/productRepository'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'

const ProductRepositoryDetailNav = ({ product, scrollRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { loading, error, data } = useQuery(PRODUCT_REPOSITORIES_QUERY, {
    variables: { productSlug: product.slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.productRepositories) {
    return <NotFound />
  }

  const { productRepositories } = data

  let productRepositoryNavOptions = []
  if (productRepositories) {
    productRepositoryNavOptions = productRepositories.map((productRepository, index) => {
      return {
        label: <div className='px-2'>{`${index + 1}. ${productRepository.name}`}</div>,
        value: `ui.product.detail.repositories.${productRepository.slug}`
      }
    })
  }

  const navOptions = [ {
    label: format('ui.product.parent.detail'),
    value: 'ui.product.parent.detail'
  }, ...productRepositoryNavOptions, {
    label: format('ui.common.detail.top'),
    value: 'ui.common.detail.top'
  }]

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
