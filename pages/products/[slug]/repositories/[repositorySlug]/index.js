import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../components/shared/Header'
import Footer from '../../../../../components/shared/Footer'
import ProductRepositoryDetail from '../../../../../components/product/repository/ProductRepositoryDetail'

const ProductRepository = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query : { slug, repositorySlug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.product.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.product.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={['default', 'fao']}>
        <Header />
        <ProductRepositoryDetail productSlug={slug} repositorySlug={repositorySlug} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ProductRepository
