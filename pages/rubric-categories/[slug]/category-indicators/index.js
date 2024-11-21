import { useCallback, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Footer from '../../../../components/shared/Footer'
import Header from '../../../../components/shared/Header'
import { handleLoadingSession } from '../../../../components/shared/SessionQueryHandler'
import ClientOnly from '../../../../lib/ClientOnly'

const RubricCategoryIndicatorsPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { query: { slug } }= router

  useEffect(() => {
    router.push(`/rubric-categories/${slug}`)
  }, [router, slug])

  return (
    <>
      <NextSeo
        title={format('ui.rubricCategory.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.rubricCategory.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <Header />
        {handleLoadingSession()}
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

export default RubricCategoryIndicatorsPage
