import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../components/shared/Header'
import Footer from '../../../../../components/shared/Footer'
import CategoryIndicatorDetail from '../../../../../components/category-indicator/CategoryIndicatorDetail'

const CategoryIndicatorPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { query: { slug, indicatorSlug } }= router

  return (
    <>
      <NextSeo
        title={format('categoryIndicator.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('categoryIndicator.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <CategoryIndicatorDetail
          categorySlug={slug}
          indicatorSlug={indicatorSlug}
        />
        <Footer />
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

export default CategoryIndicatorPage
