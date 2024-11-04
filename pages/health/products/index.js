import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import { useRouter } from 'next/router'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'
import QueryNotification from '../../../components/shared/QueryNotification'
import HealthHeader from '../../../components/health/sections/HealthHeader'
import HealthFooter from '../../../components/health/sections/HealthFooter'
import ProductRibbon from '../../../components/health/product/fragments/ProductRibbon'
import HealthProducts from '../../../components/health/sections/HealthProducts'
import ProductCompareBar from '../../../components/product/fragments/ProductCompareBar'

const ProductListPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const router = useRouter()

  const createClicked = (e) => {
    e.preventDefault()
    if (user) {
      router.push('/health/products/create')
    }
  }

  return (
    <>
      <NextSeo
        title={format('ui.product.header')}
        description={
          format(
            'health.metadata.description.listOfKey',
            { entities: format('ui.product.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <HealthHeader />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <ProductRibbon />
          { user?.isAdminUser &&
          <div className='px-4 lg:px-8 xl:px-56 pt-8'>
            <div className='bg-dial-iris-blue rounded-md w-24 text-white flex ml-auto'>
              <a href='#' onClick={createClicked}>
                <div className='px-5 py-1.5 flex align-right'>
                  {format('app.create').toUpperCase()}
                </div>
              </a>
            </div>
          </div>
          }
          <HealthProducts />
          <ProductCompareBar />
        </div>
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

export default ProductListPage
