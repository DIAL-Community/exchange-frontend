import Head from 'next/head'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import BuildingBlockForm from '../../../components/building-blocks/BuildingBlockForm'
import NotFound from '../../../components/shared/NotFound'
import { BUILDING_BLOCK_QUERY } from '../../../queries/building-block'

const CreateBuildingBlock = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data } = useQuery(BUILDING_BLOCK_QUERY, {
    variables: { slug: slug, locale: locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <>
      <Head>
        <title>{format({ id: 'app.title' })}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {data?.buildingBlock && (
        <div className='max-w-catalog mx-auto'>
          <ClientOnly>
            <BuildingBlockForm buildingBlock={data.buildingBlock} />
          </ClientOnly>
        </div>
      )}
      <Footer />
    </>
  )
}

export default CreateBuildingBlock
