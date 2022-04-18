import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import UseCaseDetailLeft from './UseCaseDetailLeft'
import UseCaseDetailRight from './UseCaseDetailRight'

const USE_CASE_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      id
      name
      slug
      imageFile
      useCaseDescription {
        description
        locale
      }
      sdgTargets {
        id
        name
        targetNumber
        sustainableDevelopmentGoal {
          slug
        }
      }
      workflows {
        name
        slug
        imageFile
      }
      buildingBlocks {
        name
        slug
        maturity
        imageFile
      }
      useCaseHeaders {
        header
      }
    }
  }
`

const UseCaseDetail = ({ slug, locale }) => {
  const { loading, error, data, refetch } = useQuery(USE_CASE_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.useCase &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <UseCaseDetailLeft useCase={data.useCase} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <UseCaseDetailRight useCase={data.useCase} />
            </div>
          </div>
      }
    </>
  )
}

export default UseCaseDetail
