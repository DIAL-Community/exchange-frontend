import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import ClientOnly from '../../../../../../lib/ClientOnly'
import ProductRepositoryDetail from '../../../../../../components/health/product/repository/ProductRepositoryDetail'
import HealthHeader from '../../../../../../components/health/sections/HealthHeader'
import HealthFooter from '../../../../../../components/health/sections/HealthFooter'

const ProductRepository = ({ defaultTenants }) => {
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
      <ClientOnly clientTenants={defaultTenants}>
        <HealthHeader />
        <ProductRepositoryDetail productSlug={slug} repositorySlug={repositorySlug} />
        <HealthFooter />
      </ClientOnly>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default ProductRepository
