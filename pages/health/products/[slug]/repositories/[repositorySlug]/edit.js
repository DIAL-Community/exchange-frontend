import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import { useRouter } from 'next/router'
import ClientOnly from '../../../../../../lib/ClientOnly'
import ProductRepositoryEdit from '../../../../../../components/health/product/repository/ProductRepositoryEdit'
import HealthHeader from '../../../../../../components/health/sections/HealthHeader'
import HealthFooter from '../../../../../../components/health/sections/HealthFooter'

const EditProductRepositoryPage = ({ defaultTenants }) => {
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
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ProductRepositoryEdit productSlug={slug} repositorySlug={repositorySlug} />
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

export default EditProductRepositoryPage
