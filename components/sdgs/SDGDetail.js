import { gql, useQuery } from '@apollo/client'
import { Error, Loading } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import SDGDetailLeft from './SDGDetailLeft'
import SDGDetailRight from './SDGDetailRight'

const SDG_QUERY = gql`
  query SDG($slug: String!) {
    sdg(slug: $slug) {
      id
      name
      slug
      number
      imageFile
      longTitle
      sdgTargets {
        id
        name
        imageFile
        targetNumber
        useCases {
          id
          slug
          name
          imageFile
        }
      }
    }
  }
`

const SDGDetail = ({ slug }) => {
  const { loading, error, data } = useQuery(SDG_QUERY, {
    variables: { slug },
    skip: !slug
  })

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.sdg &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <SDGDetailLeft sdg={data.sdg} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <SDGDetailRight sdg={data.sdg} />
            </div>
          </div>
      }
    </>
  )
}

export default SDGDetail
