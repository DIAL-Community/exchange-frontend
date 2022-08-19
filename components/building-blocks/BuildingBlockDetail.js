import { useQuery } from '@apollo/client'
import { useSession } from 'next-auth/client'
import { useUser } from '../../lib/hooks'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { BUILDING_BLOCK_DETAIL_QUERY } from '../../queries/building-block'
import BuildingBlockDetailLeft from './BuildingBlockDetailLeft'
import BuildingBlockDetailRight from './BuildingBlockDetailRight'

const BuildingBlockDetail = ({ slug, locale }) => {
  const { loading, error, data } = useQuery(BUILDING_BLOCK_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  const [session] = useSession()

  const { isAdminUser: canEdit } = useUser(session)

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.buildingBlock &&
          <div className='flex flex-col lg:flex-row pb-8 max-w-catalog mx-auto max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <BuildingBlockDetailLeft
                buildingBlock={data.buildingBlock}
              />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <BuildingBlockDetailRight
                buildingBlock={data.buildingBlock}
                canEdit={canEdit}
              />
            </div>
          </div>
      }
    </>
  )
}

export default BuildingBlockDetail
