import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import BuildingBlockForm from '../../../components/building-blocks/BuildingBlockForm'
import NotFound from '../../../components/shared/NotFound'
import { BUILDING_BLOCK_QUERY } from '../../../queries/building-block'

const EditBuildingBlock = () => {
  const router = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data } = useQuery(BUILDING_BLOCK_QUERY, {
    variables: { slug, locale },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.buildingBlock) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      <ClientOnly>
        { data?.buildingBlock && <BuildingBlockForm buildingBlock={data.buildingBlock} /> }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditBuildingBlock
